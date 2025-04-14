const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Test the connection
const connectDB = async () => {
  try {
    await pool.query('SELECT NOW()');
    logger.info(`PostgreSQL Connected: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  } catch (error) {
    logger.error(`Error connecting to PostgreSQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { pool, connectDB }; 