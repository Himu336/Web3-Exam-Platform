require('dotenv').config();
const { pool } = require('../config/db');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

async function runMigrations() {
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');

    logger.info('Running database migrations...');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
        department VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        roll_number VARCHAR(255),
        program VARCHAR(255),
        semester VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    logger.info('Created users table');

    // Create questions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        question_text TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_option_index INTEGER NOT NULL,
        marks INTEGER NOT NULL DEFAULT 1,
        difficulty VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
        subject VARCHAR(255) NOT NULL,
        topic VARCHAR(255) NOT NULL,
        faculty_id INTEGER NOT NULL REFERENCES users(id),
        is_approved BOOLEAN NOT NULL DEFAULT false,
        status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    logger.info('Created questions table');

    // Create exams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS exams (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL, -- in minutes
        total_marks INTEGER NOT NULL,
        total_questions INTEGER NOT NULL DEFAULT 0,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT false,
        status VARCHAR(50) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    logger.info('Created exams table');

    // Create exam_questions table (junction table for exams and questions)
    await client.query(`
      CREATE TABLE IF NOT EXISTS exam_questions (
        id SERIAL PRIMARY KEY,
        exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
        question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        marks INTEGER NOT NULL DEFAULT 1,
        UNIQUE(exam_id, question_id)
      )
    `);
    logger.info('Created exam_questions table');

    // Create exam_faculties table (junction table for exams and faculties)
    await client.query(`
      CREATE TABLE IF NOT EXISTS exam_faculties (
        id SERIAL PRIMARY KEY,
        exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
        faculty_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(exam_id, faculty_id)
      )
    `);
    logger.info('Created exam_faculties table');

    // Create results table
    await client.query(`
      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES users(id),
        exam_id INTEGER NOT NULL REFERENCES exams(id),
        total_marks INTEGER NOT NULL DEFAULT 0,
        max_marks INTEGER NOT NULL DEFAULT 0,
        percentage DECIMAL(5,2),
        status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'validated')),
        submitted_at TIMESTAMP,
        validated_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, exam_id)
      )
    `);
    logger.info('Created results table');

    // Create answers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        result_id INTEGER NOT NULL REFERENCES results(id) ON DELETE CASCADE,
        question_id INTEGER NOT NULL REFERENCES questions(id),
        selected_option INTEGER,
        is_correct BOOLEAN,
        marks INTEGER NOT NULL DEFAULT 0,
        UNIQUE(result_id, question_id)
      )
    `);
    logger.info('Created answers table');

    // Create activity_log table for tracking user actions
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action_type VARCHAR(255) NOT NULL,
        entity_type VARCHAR(255) NOT NULL,
        entity_id INTEGER,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    logger.info('Created activity_log table');

    // Create admin user if not exists
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await client.query(`
      INSERT INTO users (username, email, password, role)
      VALUES ('admin', 'admin@example.com', $1, 'admin')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);
    logger.info('Admin user created or already exists');

    // Create sample faculty user if not exists
    const facultyPassword = await bcrypt.hash('faculty123', salt);
    
    await client.query(`
      INSERT INTO users (username, email, password, role, department)
      VALUES ('faculty', 'faculty@example.com', $1, 'faculty', 'Computer Science')
      ON CONFLICT (email) DO NOTHING
    `, [facultyPassword]);
    logger.info('Faculty user created or already exists');

    // Create sample student user if not exists
    const studentPassword = await bcrypt.hash('student123', salt);
    
    await client.query(`
      INSERT INTO users (username, email, password, role)
      VALUES ('student', 'student@example.com', $1, 'student')
      ON CONFLICT (email) DO NOTHING
    `, [studentPassword]);
    logger.info('Student user created or already exists');

    // Commit transaction
    await client.query('COMMIT');
    logger.info('Database migrations completed successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Migration error: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('Migrations completed. Exiting...');
      process.exit(0);
    })
    .catch(err => {
      logger.error(`Migration failed: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { runMigrations }; 