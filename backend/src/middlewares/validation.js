const { body, validationResult } = require('express-validator');

const validateAuth = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
];

const validatePost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Tiêu đề không được để trống')
    .isLength({ min: 5, max: 255 })
    .withMessage('Tiêu đề phải từ 5-255 ký tự'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Nội dung không được để trống')
    .isLength({ min: 10 })
    .withMessage('Nội dung phải có ít nhất 10 ký tự'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags phải là mảng'),
];

const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Nội dung bình luận không được để trống')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Nội dung bình luận quá dài'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  validateAuth,
  validatePost,
  validateComment,
  handleValidationErrors,
};
