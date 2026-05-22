const { Op } = require('sequelize');
const { randomBytes } = require('crypto');
const { User, Post, Comment, Tag, sequelize } = require('../models');
const { hashPassword } = require('../utils/password');
const { sendPasswordResetEmail } = require('../utils/notificationService');

function sanitizeUser(user) {
  const plain = user.get ? user.get({ plain: true }) : user;
  delete plain.passwordHash;
  return plain;
}

async function getUsers(req, res, next) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash'] },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      status = 'active',
      department = null,
      faculty = null,
      class: className = null,
      avatar = null,
    } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: hashPassword(password || '123456'),
      role,
      status,
      department,
      faculty,
      class: className,
      avatar,
    });

    res.status(201).json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updateData = { ...req.body };

    if (updateData.email) {
      const duplicated = await User.findOne({
        where: {
          email: updateData.email,
          id: { [Op.ne]: req.params.id },
        },
      });
      if (duplicated) {
        return res.status(400).json({ message: 'Email đã tồn tại.' });
      }
    }

    if (updateData.password) {
      updateData.passwordHash = hashPassword(updateData.password);
      delete updateData.password;
    }

    await user.update(updateData);

    const updated = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash'] },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
}

async function lockUser(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ status: 'locked' });
    res.json({ message: 'User locked' });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newPassword = randomBytes(6).toString('hex');
    await user.update({ passwordHash: hashPassword(newPassword) });

    try {
      await sendPasswordResetEmail(user.email, newPassword);
    } catch (emailError) {
      console.warn('Email sending failed but password reset succeeded:', emailError.message);
    }

    res.json({
      message: 'Mật khẩu đã được đặt lại',
      newPassword,
    });
  } catch (error) {
    next(error);
  }
}

async function getPosts(req, res, next) {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email', 'role'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'color'] },
      ],
    });
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await post.destroy();
    res.json({ message: 'Post deleted' });
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

async function createTag(req, res, next) {
  try {
    const { name, color } = req.body;

    const existing = await Tag.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: 'Tag đã tồn tại.' });
    }

    const tag = await Tag.create({
      name,
      color: color || '#7B61FF',
      usageCount: 0,
    });

    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
}

async function updateTag(req, res, next) {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });

    const { name, color } = req.body;

    if (name) {
      const duplicated = await Tag.findOne({
        where: {
          name,
          id: { [Op.ne]: req.params.id },
        },
      });
      if (duplicated) {
        return res.status(400).json({ message: 'Tag đã tồn tại.' });
      }
    }

    await tag.update({
      ...(name ? { name } : {}),
      ...(color ? { color } : {}),
    });

    res.json(tag);
  } catch (error) {
    next(error);
  }
}

async function deleteTag(req, res, next) {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });

    await tag.destroy();
    res.json({ message: 'Tag deleted' });
  } catch (error) {
    next(error);
  }
}

async function getStats(req, res, next) {
  try {
    const totalUsers = await User.count();
    const totalPosts = await Post.count();
    const totalComments = await Comment.count();

    const popularTags = await Tag.findAll({
      attributes: [
        'name',
        'color',
        [sequelize.fn('COUNT', sequelize.col('posts.id')), 'count'],
      ],
      include: [{ model: Post, as: 'posts', attributes: [] }],
      group: ['Tag.id'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 5,
      subQuery: false,
    });

    res.json({
      totalUsers,
      totalPosts,
      totalComments,
      popularTags: popularTags.map((tag) => ({
        name: tag.name,
        color: tag.color,
        count: Number(tag.get('count')),
      })),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  lockUser,
  resetPassword,
  getPosts,
  deletePost,
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getStats,
};