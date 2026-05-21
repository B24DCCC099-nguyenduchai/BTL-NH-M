const express = require('express');
const forumController = require('../controllers/forumController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/posts', forumController.getPosts);
router.get('/posts/:id', forumController.getPostById);
router.post('/posts', authenticate, forumController.createPost);
router.delete('/posts/:id', authenticate, forumController.deletePost);
router.post('/posts/:id/vote', authenticate, forumController.votePost);
router.get('/posts/:id/comments', forumController.getComments);
router.post('/posts/:id/comments', authenticate, forumController.createComment);
router.post('/comments/:id/vote', authenticate, forumController.voteComment);
router.get('/search', forumController.searchPosts);
router.get('/tags', forumController.getTags);

module.exports = router;
