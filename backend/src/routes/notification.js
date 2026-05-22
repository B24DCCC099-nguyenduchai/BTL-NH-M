const express = require('express');
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/new-post', authenticate, notificationController.newPostNotification);
router.post('/new-comment', authenticate, notificationController.newCommentNotification);

router.get('/', authenticate, notificationController.getNotifications);
router.get('/settings', authenticate, notificationController.getSettings);

// đặt /read-all trước /:id/read để tránh conflict route
router.put('/read-all', authenticate, notificationController.markAllAsRead);
router.put('/:id/read', authenticate, notificationController.markAsRead);

module.exports = router;