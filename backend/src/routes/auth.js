const express = require('express');

const authController = require('../controllers/authController');

const { authenticate } = require('../middlewares/authMiddleware');

const {
  validateAuth,
  validateRegister,
  handleValidationErrors,
} = require('../middlewares/validation');

const router = express.Router();

/**
 * ===============================
 * AUTH ROUTES
 * ===============================
 */

/**
 * Đăng ký tài khoản
 * role:
 * - student
 * - lecturer
 */
router.post(
  '/register',
  validateRegister,
  handleValidationErrors,
  authController.register,
);

/**
 * Đăng nhập
 */
router.post(
  '/login',
  validateAuth,
  handleValidationErrors,
  authController.login,
);

/**
 * Đăng xuất
 */
router.post('/logout', authController.logout);

/**
 * Reset mật khẩu
 */
router.post('/reset-password', authController.resetPassword);

/**
 * Lấy thông tin người dùng hiện tại
 *
 * ✅ MỚI THÊM:
 * authenticate middleware
 *
 * Nếu không có token:
 * -> trả về 401 Unauthorized
 *
 * Nếu token hợp lệ:
 * -> req.user sẽ tồn tại
 */
router.get(
  '/me',
  authenticate, // ✅ FIX CHÍNH
  authController.profile,
);

module.exports = router;