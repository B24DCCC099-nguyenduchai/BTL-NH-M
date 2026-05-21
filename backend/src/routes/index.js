const express = require('express');
const authRoutes = require('./auth');
const forumRoutes = require('./forum');
const adminRoutes = require('./admin');
const notificationRoutes = require('./notification');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/forum', forumRoutes);
router.use('/admin', adminRoutes);
router.use('/notification', notificationRoutes);

router.get('/', (req, res) => res.json({ message: 'Forum API is running.' }));

module.exports = router;
