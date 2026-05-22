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

const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Họ tên không được để trống')
    .isLength({ min: 2, max: 100 })
    .withMessage('Họ tên phải từ 2-100 ký tự'),
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('role')
    .optional()
    .isIn(['student', 'lecturer'])
    .withMessage('Vai trò không hợp lệ'),
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
  body('category')
    .optional()
    .isString()
    .trim(),
];

const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Nội dung bình luận không được để trống')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Nội dung bình luận quá dài'),
  body('parentCommentId')
    .optional({ nullable: true })
    .isUUID()
    .withMessage('parentCommentId không hợp lệ'),
];

const validateVote = [
  body('direction')
    .isIn(['up', 'down'])
    .withMessage('direction chỉ được là up hoặc down'),
];

const validateUserCreate = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Họ tên không được để trống')
    .isLength({ min: 2, max: 100 })
    .withMessage('Họ tên phải từ 2-100 ký tự'),
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('role')
    .optional()
    .isIn(['student', 'lecturer', 'admin'])
    .withMessage('Vai trò không hợp lệ'),
];

const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Họ tên không được để trống'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('role')
    .optional()
    .isIn(['student', 'lecturer', 'admin'])
    .withMessage('Vai trò không hợp lệ'),
  body('status')
    .optional()
    .isIn(['active', 'locked'])
    .withMessage('Trạng thái không hợp lệ'),
];

const validateTagCreate = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tên tag không được để trống')
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên tag phải từ 2-50 ký tự'),
  body('color')
    .optional()
    .isString()
    .matches(/^#([0-9A-Fa-f]{3}){1,2}$/)
    .withMessage('Color phải là mã hex hợp lệ'),
];

const validateTagUpdate = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tên tag không được để trống')
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên tag phải từ 2-50 ký tự'),
  body('color')
    .optional()
    .isString()
    .matches(/^#([0-9A-Fa-f]{3}){1,2}$/)
    .withMessage('Color phải là mã hex hợp lệ'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  validateAuth,
  validateRegister,
  validatePost,
  validateComment,
  validateVote,
  validateUserCreate,
  validateUserUpdate,
  validateTagCreate,
  validateTagUpdate,
  handleValidationErrors,
};