const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostVote = sequelize.define('PostVote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  postId: {
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
  tableName: 'PostVotes',
  timestamps: true,

  indexes: [
    {
      unique: true,
      fields: ['postId', 'userId'],
    },
    {
      fields: ['postId'],
    },
    {
      fields: ['userId'],
    },
  ],
});

module.exports = PostVote;