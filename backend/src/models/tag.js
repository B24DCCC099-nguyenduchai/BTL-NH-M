const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tag = sequelize.define('Tag', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  color: { type: DataTypes.STRING, defaultValue: '#7B61FF' },
  usageCount: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'Tags',
  timestamps: true,
});

module.exports = Tag;
