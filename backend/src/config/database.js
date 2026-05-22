require('dotenv').config();
const { Sequelize } = require('sequelize');

if (!process.env.DB_NAME || !process.env.DB_USER) {
  throw new Error('Missing database environment variables');
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'forum_app',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '14112006',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;