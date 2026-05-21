const { Op } = require('sequelize');
const { Post, Comment, Tag, User } = require('../models');
const { notifyUser } = require('../utils/notificationService');

async function getPosts(req, res, next) {
  try {
    const posts = await Post.findAll({ include: [{ model: User, as: 'author', attributes: ['id', 'name'] }, { model: Tag, as: 'tags' }] });
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

async function getPostById(req, res, next) {
  try {
    const { id } = req.params;
    // increment views when post is retrieved for detail view
    const postRecord = await Post.findByPk(id);
    if (!postRecord) return res.status(404).json({ message: 'Post not found' });
    await postRecord.increment('views');
    const post = await Post.findByPk(id, { include: [{ model: User, as: 'author', attributes: ['id', 'name'] }, { model: Tag, as: 'tags' }] });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const { title, content, tags, category } = req.body;
    const post = await Post.create({ title, content, authorId: req.user.id, category });
    if (tags && tags.length) {
      const tagRecords = await Promise.all(tags.map((name) => Tag.findOrCreate({ where: { name } })));
      await post.setTags(tagRecords.map(([tag]) => tag));
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
    
    // Only admin or post author can delete
    if (req.user.role !== 'admin' && post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Only admin or author can delete' });
    }
    
    await Post.destroy({ where: { id } });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
}

async function votePost(req, res, next) {
  try {
    const { id } = req.params;
    const { direction } = req.body;
    
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    // Check if user already voted
    const existingVote = await PostVote.findOne({
      where: { postId: id, userId: req.user.id },
    });
    
    if (existingVote) {
      // If same vote, remove it
      if (existingVote.voteType === direction) {
        await existingVote.destroy();
        post.votes -= direction === 'up' ? 1 : -1;
      } else {
        // Change vote
        const oldValue = existingVote.voteType === 'up' ? 1 : -1;
        const newValue = direction === 'up' ? 1 : -1;
        post.votes -= oldValue;
        post.votes += newValue;
        existingVote.voteType = direction;
        await existingVote.save();
      }
    } else {
      // New vote
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
    const comments = await Comment.findAll({ where: { postId: id }, include: [{ model: User, as: 'author', attributes: ['id', 'name'] }] });
    res.json(comments);
  } catch (error) {
    next(error);
  }
}

async function createComment(req, res, next) {
  try {
    const { id } = req.params;
    const { content, parentCommentId } = req.body;
    const post = await Post.findByPk(id, { include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }] });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({ postId: id, authorId: req.user.id, content, parentCommentId });
    await Post.increment('answersCount', { where: { id } });

    if (post.authorId !== req.user.id) {
      await notifyUser(
        post.authorId,
        'new_comment',
        id,
        `Bài viết của bạn "${post.title}" vừa có phản hồi mới.`,
      );
    }

    if (parentCommentId) {
      const parentComment = await Comment.findByPk(parentCommentId, { include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }] });
      if (parentComment && parentComment.authorId !== req.user.id && parentComment.authorId !== post.authorId) {
        await notifyUser(
          parentComment.authorId,
          'reply_comment',
          id,
          `Bình luận của bạn vừa có phản hồi mới.`,
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
    
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    // Check if user already voted
    const existingVote = await CommentVote.findOne({
      where: { commentId: id, userId: req.user.id },
    });
    
    if (existingVote) {
      // If same vote, remove it
      if (existingVote.voteType === direction) {
        await existingVote.destroy();
        comment.votes -= direction === 'up' ? 1 : -1;
      } else {
        // Change vote
        const oldValue = existingVote.voteType === 'up' ? 1 : -1;
        const newValue = direction === 'up' ? 1 : -1;
        comment.votes -= oldValue;
        comment.votes += newValue;
        existingVote.voteType = direction;
        await existingVote.save();
      }
    } else {
      // New vote
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

async function searchPosts(req, res, next) {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const condition = q
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${q}%` } },
            { content: { [Op.like]: `%${q}%` } },
            { '$tags.name$': { [Op.like]: `%${q}%` } },
          ],
        }
      : {};

    const { count, rows } = await Post.findAndCountAll({
      where: condition,
      include: [
        { model: Tag, as: 'tags' },
        { model: User, as: 'author', attributes: ['id', 'name'] },
      ],
      subQuery: false,
      distinct: true,
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });
    
    res.json({
      data: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
}

async function getTags(req, res, next) {
  try {
    const tags = await Tag.findAll();
    res.json(tags);
  } catch (error) {
    next(error);
  }
}

module.exports = { getPosts, getPostById, createPost, deletePost, votePost, getComments, createComment, voteComment, searchPosts, getTags };
