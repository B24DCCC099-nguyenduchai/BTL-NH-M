// ✨ TẠO FILE MỚI: backend/validators/forumValidator.js
const { body, param, query, validationResult } = require('express-validator');

const forumValidator = {
  // Create post validator
  createPost: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required')
      .isLength({ min: 10, max: 50000 }).withMessage('Content must be 10-50000 characters'),
    body('tags')
      .isArray({ min: 0, max: 10 }).withMessage('Tags must be an array with max 10 items')
      .custom((tags) => {
        tags.forEach(tag => {
          if (typeof tag !== 'string' || tag.length < 2 || tag.length > 50) {
            throw new Error('Each tag must be a string with 2-50 characters');
          }
        });
        return true;
      })
  ],

  // Create comment validator
  createComment: [
    body('content')
      .trim()
      .notEmpty().withMessage('Comment cannot be empty')
      .isLength({ min: 1, max: 2000 }).withMessage('Comment must be 1-2000 characters')
  ],

  // Vote validator
  vote: [
    body('voteType')
      .isIn([1, -1]).withMessage('Vote type must be 1 (up) or -1 (down)')
  ],

  // Search query validator
  search: [
    query('keyword')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Keyword must be 2-100 characters'),
    query('tag')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Tag must be 2-50 characters'),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be >= 1'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
    query('sort')
      .optional()
      .isIn(['newest', 'hot', 'votes', 'views', 'comments'])
      .withMessage('Invalid sort option')
  ],

  // Middleware để kiểm tra validation
  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    next();
  }
};

module.exports = forumValidator;