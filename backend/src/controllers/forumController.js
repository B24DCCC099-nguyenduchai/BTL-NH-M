const { Op } = require('sequelize');
const {
  Post,
  Comment,
  Tag,
  User,
  PostVote,
  CommentVote,
} = require('../models');
const { notifyUser } = require('../utils/notificationService');

function buildCommentTree(comments) {
  const map = new Map();
  const roots = [];

  comments.forEach((comment) => {
    const plain = comment.get ? comment.get({ plain: true }) : comment;
    map.set(plain.id, { ...plain, replies: [] });
  });

  map.forEach((comment) => {
    if (comment.parentCommentId && map.has(comment.parentCommentId)) {
      map.get(comment.parentCommentId).replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
}

function getOrder(sort = 'newest') {
  switch (sort) {
    case 'oldest':
      return [['createdAt', 'ASC']];
    case 'views':
      return [['views', 'DESC']];
    case 'votes':
      return [['votes', 'DESC']];
    case 'answers':
      return [['answersCount', 'DESC']];
    case 'newest':
    default:
      return [['createdAt', 'DESC']];
  }
}

async function fetchPosts(req, res, next) {
  try {
    const {
      q = '',
      tag = '',
      category = '',
      page = 1,
      limit = 10,
      sort = 'newest',
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const where = {};
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } },
      ];
    }
    if (category) {
      where.category = category;
    }

    const tagInclude = {
      model: Tag,
      as: 'tags',
      attributes: ['id', 'name', 'color', 'usageCount'],
      through: { attributes: [] },
    };

    if (tag) {
      tagInclude.where = { name: tag };
      tagInclude.required = true;
    }

    const { count, rows } = await Post.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email', 'role', 'avatar'] },
        tagInclude,
      ],
      distinct: true,
      subQuery: false,
      order: getOrder(sort),
      offset,
      limit: Number(limit),
    });

    res.json({
      data: rows,
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
}

async function getPosts(req, res, next) {
  return fetchPosts(req, res, next);
}

async function searchPosts(req, res, next) {
  return fetchPosts(req, res, next);
}

async function getPostById(req, res, next) {
  try {
    const { id } = req.params;

    const postRecord = await Post.findByPk(id);
    if (!postRecord) return res.status(404).json({ message: 'Post not found' });

    await postRecord.increment('views');

    const post = await Post.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email', 'role', 'avatar'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'color', 'usageCount'], through: { attributes: [] } },
      ],
    });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const { title, content, tags, category } = req.body;

    const post = await Post.create({
      title,
      content,
      authorId: req.user.id,
      category: category || null,
    });

    const tagRecords = [];
    if (Array.isArray(tags) && tags.length > 0) {
      for (const rawTag of tags) {
        const name = typeof rawTag === 'string' ? rawTag.trim() : String(rawTag?.name || '').trim();
        if (!name) continue;

        const [tag, created] = await Tag.findOrCreate({
          where: { name },
          defaults: {
            name,
            color: '#7B61FF',
            usageCount: 0,
          },
        });

        if (created) {
          await tag.update({ usageCount: 1 });
        } else {
          await tag.increment('usageCount');
        }

        tagRecords.push(tag);
      }

      if (tagRecords.length > 0) {
        await post.setTags(tagRecords);
      }
    }

    await notifyUser(
      req.user.id,
      'post_created',
      post.id,
      `Bài viết "${title}" đã được đăng thành công trên diễn đàn.`,
    );

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (req.user.role !== 'admin' && post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Only admin or author can delete' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
}

async function votePost(req, res, next) {
  try {
    const { id } = req.params;
    const { direction } = req.body;

    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({ message: 'direction phải là up hoặc down' });
    }

    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const existingVote = await PostVote.findOne({
      where: { postId: id, userId: req.user.id },
    });

    if (existingVote) {
      if (existingVote.voteType === direction) {
        await existingVote.destroy();
        post.votes += direction === 'up' ? -1 : 1;
      } else {
        const oldValue = existingVote.voteType === 'up' ? 1 : -1;
        const newValue = direction === 'up' ? 1 : -1;
        post.votes = post.votes - oldValue + newValue;
        existingVote.voteType = direction;
        await existingVote.save();
      }
    } else {
      await PostVote.create({
        postId: id,
        userId: req.user.id,
        voteType: direction,
      });
      post.votes += direction === 'up' ? 1 : -1;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
}

async function getComments(req, res, next) {
  try {
    const { id } = req.params;

    const comments = await Comment.findAll({
      where: { postId: id },
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email', 'role', 'avatar'] },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.json(buildCommentTree(comments));
  } catch (error) {
    next(error);
  }
}

async function createComment(req, res, next) {
  try {
    const { id } = req.params;
    const { content, parentCommentId } = req.body;

    const post = await Post.findByPk(id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
    });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (parentCommentId) {
      const parentComment = await Comment.findByPk(parentCommentId);
      if (!parentComment || String(parentComment.postId) !== String(id)) {
        return res.status(400).json({ message: 'Bình luận cha không hợp lệ' });
      }
    }

    const comment = await Comment.create({
      postId: id,
      authorId: req.user.id,
      content,
      parentCommentId: parentCommentId || null,
    });

    // Chỉ tăng answersCount cho comment cấp 1
    if (!parentCommentId) {
      await Post.increment('answersCount', { where: { id } });
    }

    if (post.authorId !== req.user.id) {
      await notifyUser(
        post.authorId,
        'new_comment',
        id,
        `Bài viết của bạn "${post.title}" vừa có phản hồi mới.`,
      );
    }

    if (parentCommentId) {
      const parentComment = await Comment.findByPk(parentCommentId, {
        include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
      });

      if (
        parentComment &&
        parentComment.authorId !== req.user.id &&
        parentComment.authorId !== post.authorId
      ) {
        await notifyUser(
          parentComment.authorId,
          'reply_comment',
          id,
          'Bình luận của bạn vừa có phản hồi mới.',
        );
      }
    }

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
}

async function voteComment(req, res, next) {
  try {
    const { id } = req.params;
    const { direction } = req.body;

    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({ message: 'direction phải là up hoặc down' });
    }

    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const existingVote = await CommentVote.findOne({
      where: { commentId: id, userId: req.user.id },
    });

    if (existingVote) {
      if (existingVote.voteType === direction) {
        await existingVote.destroy();
        comment.votes += direction === 'up' ? -1 : 1;
      } else {
        const oldValue = existingVote.voteType === 'up' ? 1 : -1;
        const newValue = direction === 'up' ? 1 : -1;
        comment.votes = comment.votes - oldValue + newValue;
        existingVote.voteType = direction;
        await existingVote.save();
      }
    } else {
      await CommentVote.create({
        commentId: id,
        userId: req.user.id,
        voteType: direction,
      });
      comment.votes += direction === 'up' ? 1 : -1;
    }

    await comment.save();
    res.json(comment);
  } catch (error) {
    next(error);
  }
}

async function getTags(req, res, next) {
  try {
    const tags = await Tag.findAll({
      order: [
        ['usageCount', 'DESC'],
        ['name', 'ASC'],
      ],
    });
    res.json(tags);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  votePost,
  getComments,
  createComment,
  voteComment,
  searchPosts,
  getTags,
};