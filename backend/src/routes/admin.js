const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { ADMIN_ONLY } = require('../config/roles');
const {
  validateUserCreate,
  validateUserUpdate,
  validateTagCreate,
  validateTagUpdate,
  handleValidationErrors,
} = require('../middlewares/validation');

const router = express.Router();

router.use(authenticate);
router.use(authorize(ADMIN_ONLY));

router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', validateUserCreate, handleValidationErrors, adminController.createUser);
router.put('/users/:id', validateUserUpdate, handleValidationErrors, adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/lock', adminController.lockUser);
router.post('/users/:id/reset-password', adminController.resetPassword);

router.get('/posts', adminController.getPosts);
router.delete('/posts/:id', adminController.deletePost);

router.get('/tags', adminController.getTags);
router.post('/tags', validateTagCreate, handleValidationErrors, adminController.createTag);
router.put('/tags/:id', validateTagUpdate, handleValidationErrors, adminController.updateTag);
router.delete('/tags/:id', adminController.deleteTag);

router.get('/stats', adminController.getStats);

module.exports = router;