const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  postId: { type: DataTypes.UUID, allowNull: false },
  authorId: { type: DataTypes.UUID, allowNull: false },
  parentCommentId: { type: DataTypes.UUID },
  content: { type: DataTypes.TEXT, allowNull: false },
  votes: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'Comments',
  timestamps: true,
});

module.exports = Comment;
