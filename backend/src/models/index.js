// const sequelize = require('../config/database');
// const User = require('./user');
// const Post = require('./post');
// const Comment = require('./comment');
// const Tag = require('./tag');
// const Notification = require('./notification');
// const PostTag = require('./postTag');
// const PostVote = require('./postVote');
// const CommentVote = require('./commentVote');

// User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
// Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
// Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
// Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
// User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });

// Post.belongsToMany(Tag, { through: PostTag, as: 'tags' });
// Tag.belongsToMany(Post, { through: PostTag, as: 'posts' });

// Post.hasMany(PostVote, { foreignKey: 'postId', as: 'votes' });
// PostVote.belongsTo(Post, { foreignKey: 'postId' });
// PostVote.belongsTo(User, { foreignKey: 'userId' });

// Comment.hasMany(CommentVote, { foreignKey: 'commentId', as: 'votes' });
// CommentVote.belongsTo(Comment, { foreignKey: 'commentId' });
// CommentVote.belongsTo(User, { foreignKey: 'userId' });

// User.hasMany(Notification, { foreignKey: 'recipientId', as: 'notifications' });
// Notification.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

// module.exports = { sequelize, User, Post, Comment, Tag, Notification, PostTag, PostVote, CommentVote };

const sequelize = require('../config/database');

const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');
const Tag = require('./tag');
const Notification = require('./notification');
const PostTag = require('./postTag');
const PostVote = require('./postVote');
const CommentVote = require('./commentVote');

User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });

Post.belongsToMany(Tag, {
  through: PostTag,
  as: 'tags',
  foreignKey: 'postId',
  otherKey: 'tagId',
});

Tag.belongsToMany(Post, {
  through: PostTag,
  as: 'posts',
  foreignKey: 'tagId',
  otherKey: 'postId',
});

User.hasMany(Notification, {
  foreignKey: 'recipientId',
  as: 'notifications',
});

Notification.belongsTo(User, {
  foreignKey: 'recipientId',
  as: 'recipient',
});

// ===== POST VOTES =====

User.hasMany(PostVote, {
  foreignKey: 'userId',
  as: 'postVotes',
});

Post.hasMany(PostVote, {
  foreignKey: 'postId',
  as: 'postVotes',
});

PostVote.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post',
});

PostVote.belongsTo(User, {
  foreignKey: 'userId',
  as: 'voter',
});

// ===== COMMENT VOTES =====

User.hasMany(CommentVote, {
  foreignKey: 'userId',
  as: 'commentVotes',
});

Comment.hasMany(CommentVote, {
  foreignKey: 'commentId',
  as: 'commentVotes',
});

CommentVote.belongsTo(Comment, {
  foreignKey: 'commentId',
  as: 'comment',
});

CommentVote.belongsTo(User, {
  foreignKey: 'userId',
  as: 'voter',
});

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
};