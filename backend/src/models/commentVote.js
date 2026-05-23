const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommentVote = sequelize.define('CommentVote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  commentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  voteType: {
    type: DataTypes.ENUM('up', 'down'),
    allowNull: false,
  },

}, {
  tableName: 'CommentVotes',
  timestamps: true,

  indexes: [
    {
      unique: true,
      fields: ['commentId', 'userId'],
    },
    {
      fields: ['commentId'],
    },
    {
      fields: ['userId'],
    },
  ],
});

module.exports = CommentVote;