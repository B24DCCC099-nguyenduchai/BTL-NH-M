const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tag = sequelize.define(
  'Tag',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // ✅ Tên tag
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },

    // ✅ MỚI: mô tả tag
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ✅ Màu tag
    color: {
      type: DataTypes.STRING(50),
      defaultValue: '#7B61FF',
    },

    // ✅ Số lần sử dụng
    usageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'Tags',
    timestamps: true,

    // ✅ index cho search tag
    indexes: [
      {
        fields: ['name'],
      },
    ],
  },
);

module.exports = Tag;