const { pool } = require('../config/db');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

// Get all users with role filtering
exports.getAllUsers = async (req, res) => {
  const { role } = req.query;
  const client = await pool.connect();
  
  try {
    // Check if status column exists
    const checkColumnExists = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='status'
    `);
    
    const statusColumnExists = checkColumnExists.rows.length > 0;
    
    let query = statusColumnExists
      ? 'SELECT id, username, email, role, status, department, created_at FROM users'
      : 'SELECT id, username, email, role, department, created_at FROM users';
    
    const values = [];
    
    if (role) {
      query += ' WHERE role = $1';
      values.push(role);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await client.query(query, values);
    
    // If status column doesn't exist, add default status
    if (!statusColumnExists) {
      result.rows = result.rows.map(user => ({
        ...user,
        status: 'active' // Add default status
      }));
    }
    
    res.json(result.rows);
  } catch (error) {
    logger.error(`Error getting users: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      'SELECT id, username, email, role, status, department, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error(`Error getting user: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Create new user (admin only)
exports.createUser = async (req, res) => {
  const { username, email, password, role, department } = req.body;
  const client = await pool.connect();
  
  try {
    // Check if user already exists
    const userExists = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const result = await client.query(
      'INSERT INTO users (username, email, password, role, department, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, role, department, status',
      [username, email, hashedPassword, role, department, 'active']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { username, email, role, department, status } = req.body;
  const client = await pool.connect();
  
  try {
    // Check if user exists
    const userExists = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [req.params.id]
    );
    
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if status column exists
    const checkColumnExists = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='status'
    `);
    
    const statusColumnExists = checkColumnExists.rows.length > 0;
    
    // Build update query based on column existence
    let updateQuery = statusColumnExists
      ? `UPDATE users 
         SET username = $1, email = $2, role = $3, department = $4, status = $5, updated_at = NOW() 
         WHERE id = $6 
         RETURNING id, username, email, role, department, status`
      : `UPDATE users 
         SET username = $1, email = $2, role = $3, department = $4, updated_at = NOW() 
         WHERE id = $5 
         RETURNING id, username, email, role, department`;
    
    let values = statusColumnExists
      ? [username, email, role, department, status, req.params.id]
      : [username, email, role, department, req.params.id];
    
    // Update user
    const result = await client.query(updateQuery, values);
    
    // Add default status if column doesn't exist
    if (!statusColumnExists) {
      result.rows[0].status = 'active';
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const client = await pool.connect();
  
  try {
    // Check if user exists
    const userExists = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [req.params.id]
    );
    
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await client.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Get dashboard stats (admin only)
exports.getDashboardStats = async (req, res) => {
  const client = await pool.connect();
  
  try {
    // Initialize default values
    let totalUsers = 0;
    let roleCounts = {};
    let totalExams = 0;
    let totalQuestions = 0;
    let totalSessions = 0;
    let recentActivity = [];

    // Get total users count
    try {
      const usersResult = await client.query('SELECT COUNT(*) FROM users');
      totalUsers = parseInt(usersResult.rows[0].count);
      
      // Get users by role
      const roleCountsResult = await client.query(
        'SELECT role, COUNT(*) FROM users GROUP BY role'
      );
      roleCountsResult.rows.forEach(row => {
        roleCounts[row.role] = parseInt(row.count);
      });
    } catch (error) {
      logger.error(`Error counting users: ${error.message}`);
      // Continue with other queries
    }
    
    // Get total exams count
    try {
      // Check if the exams table exists
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'exams'
        )
      `);
      
      if (tableExists.rows[0].exists) {
        const examsResult = await client.query('SELECT COUNT(*) FROM exams');
        totalExams = parseInt(examsResult.rows[0]?.count || 0);
      }
    } catch (error) {
      logger.error(`Error counting exams: ${error.message}`);
      // Continue with other queries
    }
    
    // Get total questions count
    try {
      // Check if the questions table exists
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'questions'
        )
      `);
      
      if (tableExists.rows[0].exists) {
        const questionsResult = await client.query('SELECT COUNT(*) FROM questions');
        totalQuestions = parseInt(questionsResult.rows[0]?.count || 0);
      }
    } catch (error) {
      logger.error(`Error counting questions: ${error.message}`);
      // Continue with other queries
    }
    
    // Get total exam sessions count
    try {
      // Check if the results table exists
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'results'
        )
      `);
      
      if (tableExists.rows[0].exists) {
        const sessionsResult = await client.query('SELECT COUNT(*) FROM results');
        totalSessions = parseInt(sessionsResult.rows[0]?.count || 0);
      }
    } catch (error) {
      logger.error(`Error counting sessions: ${error.message}`);
      // Continue with other queries
    }
    
    // Get recent activities (last 10)
    try {
      // Build query parts based on table existence
      let queryParts = [];
      
      // Users part - always exists
      queryParts.push(`
        SELECT 'User Registration' as type, u.username as name, u.role as role, u.created_at as time
        FROM users u
      `);
      
      // Check if exams table exists
      const examsExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'exams'
        )
      `);
      
      if (examsExists.rows[0].exists) {
        queryParts.push(`
          SELECT 'Exam Created' as type, e.title as name, CAST(e.created_by AS TEXT) as created_by, e.created_at as time
          FROM exams e
        `);
      }
      
      // Check if results and exams tables exist
      const resultsExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'results'
        )
      `);
      
      if (resultsExists.rows[0].exists && examsExists.rows[0].exists) {
        queryParts.push(`
          SELECT 'Exam Completed' as type, e.title as name, CAST(r.student_id AS TEXT) as student_id, r.created_at as time
          FROM results r
          JOIN exams e ON r.exam_id = e.id
        `);
      }
      
      // Combine all query parts
      const fullQuery = queryParts.join(' UNION ALL ') + ' ORDER BY time DESC LIMIT 10';
      
      const recentResult = await client.query(fullQuery);
      recentActivity = recentResult.rows;
    } catch (error) {
      logger.error(`Error getting recent activity: ${error.message}`);
      // Continue with response
    }
    
    res.json({
      stats: {
        totalUsers,
        totalExams,
        totalQuestions,
        totalSessions,
        roleCounts
      },
      recentActivity
    });
  } catch (error) {
    logger.error(`Error getting dashboard stats: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
}; 