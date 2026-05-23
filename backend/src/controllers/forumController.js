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
      keyword = '',
      tag = '',
      category = '',
      page = 1,
      limit = 10,
      sort = 'newest',
    } = req.query;

    const searchText = String(q || keyword || '').trim();
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
    const offset = (pageNumber - 1) * limitNumber;

    const where = {};

    if (searchText) {
      where[Op.or] = [
        { title: { [Op.like]: `%${searchText}%` } },
        { content: { [Op.like]: `%${searchText}%` } },
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
      required: !!tag,
    };

    if (tag) {
      tagInclude.where = { name: tag };
    }

    const { count, rows } = await Post.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'role', 'avatar'],
        },
        tagInclude,
      ],
      distinct: true,
      subQuery: false,
      order: getOrder(sort),
      offset,
      limit: limitNumber,
    });

    res.json({
      data: rows,
      total: count,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(count / limitNumber),
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
    if (!postRecord) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await postRecord.increment('views');
    await postRecord.reload({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'role', 'avatar'],
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name', 'color', 'usageCount'],
          through: { attributes: [] },
        },
      ],
    });

    res.json(postRecord);
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
        const name =
          typeof rawTag === 'string'
            ? rawTag.trim()
            : String(rawTag?.name || '').trim();

        if (!name) continue;

        const [tag, created] = await Tag.findOrCreate({
          where: { name },
          defaults: {
            name,
            description: '',
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

async function updatePost(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, category, tags } = req.body;

    const post = await Post.findByPk(id, {
      include: [{ model: Tag, as: 'tags' }],
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.user.role !== 'admin' && post.authorId !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden: Chỉ admin hoặc tác giả mới sửa được',
      });
    }

    const oldTags = post.tags || [];
    const oldTagNames = new Set(oldTags.map((t) => t.name));

    await post.update({
      ...(typeof title === 'string' ? { title } : {}),
      ...(typeof content === 'string' ? { content } : {}),
      ...(typeof category === 'string' ? { category } : {}),
    });

    if (Array.isArray(tags)) {
      const newTagRecords = [];

      for (const rawTag of tags) {
        const name =
          typeof rawTag === 'string'
            ? rawTag.trim()
            : String(rawTag?.name || '').trim();

        if (!name) continue;

        const [tag, created] = await Tag.findOrCreate({
          where: { name },
          defaults: {
            name,
            description: '',
            color: '#7B61FF',
            usageCount: 0,
          },
        });

        if (created) {
          await tag.update({ usageCount: 1 });
        } else if (!oldTagNames.has(name)) {
          await tag.increment('usageCount');
        }

        newTagRecords.push(tag);
      }

      const newTagNames = new Set(newTagRecords.map((t) => t.name));

      for (const oldTag of oldTags) {
        if (!newTagNames.has(oldTag.name) && oldTag.usageCount > 0) {
          await oldTag.decrement('usageCount');
        }
      }

      await post.setTags(newTagRecords);
    }

    await post.reload({
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email', 'role', 'avatar'] },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name', 'color', 'usageCount'],
          through: { attributes: [] },
        },
      ],
    });

    res.json(post);
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.user.role !== 'admin' && post.authorId !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden: Chỉ admin hoặc tác giả mới xóa được',
      });
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
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
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingVote = await PostVote.findOne({
      where: { postId: id, userId: req.user.id },
    });

    const delta = direction === 'up' ? 1 : -1;

    if (existingVote) {
      if (existingVote.voteType === direction) {
        await existingVote.destroy();
        post.votes -= delta;
      } else {
        const oldDelta = existingVote.voteType === 'up' ? 1 : -1;
        post.votes = post.votes - oldDelta + delta;
        existingVote.voteType = direction;
        await existingVote.save();
      }
    } else {
      await PostVote.create({
        postId: id,
        userId: req.user.id,
        voteType: direction,
      });
      post.votes += delta;
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
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'role', 'avatar'],
        },
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

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

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

async function updateComment(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (req.user.role !== 'admin' && comment.authorId !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden: Chỉ admin hoặc tác giả mới sửa được',
      });
    }

    await comment.update({ content });

    res.json(comment);
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (req.user.role !== 'admin' && comment.authorId !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden: Chỉ admin hoặc tác giả mới xóa được',
      });
    }

    const post = await Post.findByPk(comment.postId);

    if (post && !comment.parentCommentId && post.answersCount > 0) {
      await post.decrement('answersCount');
    }

    await comment.destroy();

    res.json({ message: 'Comment deleted successfully' });
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
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const existingVote = await CommentVote.findOne({
      where: { commentId: id, userId: req.user.id },
    });

    const delta = direction === 'up' ? 1 : -1;

    if (existingVote) {
      if (existingVote.voteType === direction) {
        await existingVote.destroy();
        comment.votes -= delta;
      } else {
        const oldDelta = existingVote.voteType === 'up' ? 1 : -1;
        comment.votes = comment.votes - oldDelta + delta;
        existingVote.voteType = direction;
        await existingVote.save();
      }
    } else {
      await CommentVote.create({
        commentId: id,
        userId: req.user.id,
        voteType: direction,
      });
      comment.votes += delta;
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
// ======================================
// REPLY COMMENT
// ======================================

async function replyComment(req, res, next) {
  try {

    req.body.parentCommentId = req.params.parentCommentId;

    return createComment(req, res, next);

  } catch (error) {
    next(error);
  }
}

// ======================================
// GET USER VOTE
// ======================================

async function getUserVote(req, res, next) {
  try {

    const { postId } = req.params;

    const vote = await PostVote.findOne({
      where: {
        postId,
        userId: req.user.id,
      },
    });

    if (!vote) {
      return res.json({
        voted: false,
      });
    }

    res.json({
      voted: true,
      voteType: vote.voteType,
    });

  } catch (error) {
    next(error);
  }
}

// ======================================
// SAVE POST
// ======================================

async function savePost(req, res, next) {
  try {

    const { id } = req.params;

    const { SavedPost } = require('../models');

    const existing = await SavedPost.findOne({
      where: {
        userId: req.user.id,
        postId: id,
      },
    });

    if (existing) {

      await existing.destroy();

      return res.json({
        saved: false,
      });
    }

    await SavedPost.create({
      userId: req.user.id,
      postId: id,
    });

    res.json({
      saved: true,
    });

  } catch (error) {
    next(error);
  }
}

// ======================================
// GET SAVED POSTS
// ======================================

async function getSavedPosts(req, res, next) {
  try {

    const { SavedPost } = require('../models');

    const savedPosts = await SavedPost.findAll({

      where: {
        userId: req.user.id,
      },

      include: [
        {
          model: Post,
          as: 'post',
        },
      ],

      order: [['createdAt', 'DESC']],
    });

    res.json(savedPosts);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPosts,
  getPostById,

  createPost,
  updatePost,
  deletePost,

  votePost,
  getUserVote,

  getComments,
  createComment,
  replyComment,
  updateComment,
  deleteComment,
  voteComment,

  savePost,
  getSavedPosts,

  searchPosts,
  getTags,
};