// backend/models/index.js

const sequelize = require('../config/database');

const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');
const Tag = require('./tag');
const Notification = require('./notification');
const PostTag = require('./postTag');
const PostVote = require('./postVote');
const CommentVote = require('./commentVote');
const SavedPost = require('./savedPost');

// ======================================================
// USER - POST
// ======================================================

User.hasMany(Post, {
  foreignKey: 'authorId',
  as: 'posts',
  onDelete: 'CASCADE',
});

Post.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

// ======================================================
// POST - COMMENT
// ======================================================

Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments',
  onDelete: 'CASCADE',
});

Comment.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post',
});

// ======================================================
// USER - COMMENT
// ======================================================

User.hasMany(Comment, {
  foreignKey: 'authorId',
  as: 'comments',
  onDelete: 'CASCADE',
});

Comment.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

// ======================================================
// COMMENT REPLIES (SELF JOIN)
// ======================================================

Comment.hasMany(Comment, {
  foreignKey: 'parentCommentId',
  as: 'replies',
  onDelete: 'CASCADE',
});

Comment.belongsTo(Comment, {
  foreignKey: 'parentCommentId',
  as: 'parentComment',
});

// ======================================================
// POST - TAG (MANY TO MANY)
// ======================================================

Post.belongsToMany(Tag, {
  through: PostTag,
  foreignKey: 'postId',
  otherKey: 'tagId',
  as: 'tags',
});

Tag.belongsToMany(Post, {
  through: PostTag,
  foreignKey: 'tagId',
  otherKey: 'postId',
  as: 'posts',
});

// ======================================================
// USER - NOTIFICATION
// ======================================================

User.hasMany(Notification, {
  foreignKey: 'recipientId',
  as: 'notifications',
  onDelete: 'CASCADE',
});

Notification.belongsTo(User, {
  foreignKey: 'recipientId',
  as: 'recipient',
});

// ======================================================
// POST VOTES
// ======================================================

User.hasMany(PostVote, {
  foreignKey: 'userId',
  as: 'postVotes',
  onDelete: 'CASCADE',
});

PostVote.belongsTo(User, {
  foreignKey: 'userId',
  as: 'voter',
});

Post.hasMany(PostVote, {
  foreignKey: 'postId',
  as: 'postVotes',
  onDelete: 'CASCADE',
});

PostVote.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post',
});

// ======================================================
// COMMENT VOTES
// ======================================================

User.hasMany(CommentVote, {
  foreignKey: 'userId',
  as: 'commentVotes',
  onDelete: 'CASCADE',
});

CommentVote.belongsTo(User, {
  foreignKey: 'userId',
  as: 'voter',
});

Comment.hasMany(CommentVote, {
  foreignKey: 'commentId',
  as: 'commentVotes',
  onDelete: 'CASCADE',
});

CommentVote.belongsTo(Comment, {
  foreignKey: 'commentId',
  as: 'comment',
});

// ======================================================
// SAVED POSTS
// ======================================================

User.hasMany(SavedPost, {
  foreignKey: 'userId',
  as: 'savedPosts',
  onDelete: 'CASCADE',
});

SavedPost.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Post.hasMany(SavedPost, {
  foreignKey: 'postId',
  as: 'savedByUsers',
  onDelete: 'CASCADE',
});

SavedPost.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post',
});

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  sequelize,

  User,
  Post,
  Comment,
  Tag,
  Notification,

  PostTag,
  PostVote,
  CommentVote,
  SavedPost,
};