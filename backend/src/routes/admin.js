const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { ADMIN_ONLY } = require('../config/roles');

const router = express.Router();

router.use(authenticate);
router.use(authorize(ADMIN_ONLY));

router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/lock', adminController.lockUser);
router.post('/users/:id/reset-password', adminController.resetPassword);
router.get('/posts', adminController.getPosts);
router.delete('/posts/:id', adminController.deletePost);
router.get('/stats', adminController.getStats);

module.exports = router;
