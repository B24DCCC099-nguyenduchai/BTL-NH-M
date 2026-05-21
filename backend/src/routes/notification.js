const express = require('express');
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/new-post', authenticate, notificationController.newPostNotification);
router.post('/new-comment', authenticate, notificationController.newCommentNotification);
router.get('/', authenticate, notificationController.getNotifications);
router.get('/settings', authenticate, notificationController.getSettings);

module.exports = router;
