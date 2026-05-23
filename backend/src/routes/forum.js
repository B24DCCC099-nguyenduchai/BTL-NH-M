// ✨ CẬP NHẬT FILE: backend/routes/forum.js
const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const forumController = require('../controllers/forumController');
const forumValidator = require('../validators/forumValidator');

const router = express.Router();

// Public routes
router.get('/posts', 
  forumValidator.search,
  forumValidator.validate,
  forumController.getPosts
);

router.get('/posts/:id', 
  forumController.getPostById
);

router.get('/posts/:postId/comments', 
  forumController.getComments
);

router.get('/tags', 
  forumController.getTags
);

// Authenticated routes
router.post('/posts',
  authenticate,
  forumValidator.createPost,
  forumValidator.validate,
  forumController.createPost
);

router.put('/posts/:id',
  authenticate,
  forumValidator.createPost,
  forumValidator.validate,
  forumController.updatePost
);

router.delete('/posts/:id',
  authenticate,
  forumController.deletePost
);

router.post('/posts/:id/vote',
  authenticate,
  forumValidator.vote,
  forumValidator.validate,
  forumController.votePost
);

router.get('/posts/:postId/my-vote',
  authenticate,
  forumController.getUserVote
);

router.post('/posts/:id/save',
  authenticate,
  forumController.savePost
);

router.get('/saved-posts',
  authenticate,
  forumController.getSavedPosts
);

router.post('/posts/:postId/comments',
  authenticate,
  forumValidator.createComment,
  forumValidator.validate,
  forumController.createComment
);

router.post('/posts/:postId/comments/:parentCommentId/reply',
  authenticate,
  forumValidator.createComment,
  forumValidator.validate,
  forumController.replyComment
);

router.delete('/comments/:id',
  authenticate,
  forumController.deleteComment
);

router.post('/comments/:id/vote',
  authenticate,
  forumValidator.vote,
  forumValidator.validate,
  forumController.voteComment
);

module.exports = router;