const { User, Post, Comment, Tag, sequelize } = require('../models');
const { hashPassword } = require('../utils/password');

async function getUsers(req, res, next) {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'status', 'department', 'faculty', 'class'] });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { password, ...rest } = req.body;
    const user = await User.create({
      ...rest,
      passwordHash: hashPassword(password || '123456'),
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.passwordHash = hashPassword(updateData.password);
      delete updateData.password;
    }
    await User.update(updateData, { where: { id: req.params.id } });
    res.json({ message: 'User updated' });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
}

async function lockUser(req, res, next) {
  try {
    await User.update({ status: 'locked' }, { where: { id: req.params.id } });
    res.json({ message: 'User locked' });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { randomBytes } = require('crypto');
    const newPassword = randomBytes(6).toString('hex'); // Random 12-char hex password
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    await User.update({ passwordHash: hashPassword(newPassword) }, { where: { id: req.params.id } });
    
    // Try to send email
    try {
      const { sendPasswordResetEmail } = require('../utils/emailService');
      await sendPasswordResetEmail(user.email, newPassword);
    } catch (emailError) {
      console.warn('Email sending failed but password reset succeeded:', emailError.message);
    }
    
    res.json({ message: 'Mật khẩu đã được đặt lại', newPassword });
  } catch (error) {
    next(error);
  }
}

async function getPosts(req, res, next) {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'author', attributes: ['id', 'name'] },
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
    await Post.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Post deleted' });
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

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, lockUser, resetPassword, getPosts, deletePost, getStats };
