const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedPost = sequelize.define('SavedPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  postId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

}, {
  tableName: 'SavedPosts',
  timestamps: true,
});

module.exports = SavedPost;