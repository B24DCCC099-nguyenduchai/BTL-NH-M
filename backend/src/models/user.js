const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student', 'lecturer', 'admin'), defaultValue: 'student' },
  status: { type: DataTypes.ENUM('active', 'locked'), defaultValue: 'active' },
  department: { type: DataTypes.STRING },
  faculty: { type: DataTypes.STRING },
  class: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING },
}, {
  tableName: 'Users',
  timestamps: true,
});

module.exports = User;
