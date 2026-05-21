const { sequelize } = require('../models');

async function migrate() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database migrated successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
