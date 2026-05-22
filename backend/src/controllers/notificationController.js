const { Notification } = require('../models');
const { notifyUser } = require('../utils/notificationService');

async function newPostNotification(req, res, next) {
  try {
    const notification = await notifyUser(
      req.user.id,
      'new_post',
      req.body.postId,
      'Thông báo: bài viết mới đã được tạo.',
    );
    res.json(notification);
  } catch (error) {
    next(error);
  }
}

async function newCommentNotification(req, res, next) {
  try {
    const notification = await notifyUser(
      req.user.id,
      'new_comment',
      req.body.commentId,
      'Thông báo: bình luận mới đã được gửi.',
    );
    res.json(notification);
  } catch (error) {
    next(error);
  }
}

async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.findAll({
      where: { recipientId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
}

async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: {
        id,
        recipientId: req.user.id,
      },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({ read: true });
    res.json(notification);
  } catch (error) {
    next(error);
  }
}

async function markAllAsRead(req, res, next) {
  try {
    await Notification.update(
      { read: true },
      { where: { recipientId: req.user.id, read: false } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
}

async function getSettings(req, res) {
  const notificationsEnabled = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
  res.json({ notificationsEnabled });
}

module.exports = {
  newPostNotification,
  newCommentNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getSettings,
};