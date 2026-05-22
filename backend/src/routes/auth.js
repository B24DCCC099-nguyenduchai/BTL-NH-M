const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const {
  validateAuth,
  validateRegister,
  handleValidationErrors,
} = require('../middlewares/validation');

const router = express.Router();

router.post('/register', validateRegister, handleValidationErrors, authController.register);
router.post('/login', validateAuth, handleValidationErrors, authController.login);
router.post('/logout', authController.logout);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authenticate, authController.profile);

module.exports = router;