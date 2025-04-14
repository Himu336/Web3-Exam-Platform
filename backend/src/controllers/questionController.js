const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

// Create a new question
exports.createQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const client = await pool.connect();

  try {
    const { questionText, options, correctOptionIndex, marks, difficulty, subject, topic } = req.body;

    const result = await client.query(
      `INSERT INTO questions 
        (question_text, options, correct_option_index, marks, difficulty, subject, topic, faculty_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [questionText, JSON.stringify(options), correctOptionIndex, marks, difficulty, subject, topic, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Get all questions by faculty
exports.getQuestionsByFaculty = async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT q.*, u.username, u.email, u.department 
       FROM questions q
       JOIN users u ON q.faculty_id = u.id
       WHERE q.faculty_id = $1
       ORDER BY q.created_at DESC`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Get all questions (for admin)
exports.getAllQuestions = async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT q.*, u.username, u.email, u.department 
       FROM questions q
       JOIN users u ON q.faculty_id = u.id
       ORDER BY q.created_at DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Get questions by faculty ID (for admin)
exports.getQuestionsByFacultyId = async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT q.*, u.username, u.email, u.department 
       FROM questions q
       JOIN users u ON q.faculty_id = u.id
       WHERE q.faculty_id = $1
       ORDER BY q.created_at DESC`,
      [req.params.facultyId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Update question
exports.updateQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const client = await pool.connect();

  try {
    const { questionText, options, correctOptionIndex, marks, difficulty, subject, topic, isApproved } = req.body;

    // Get the question
    const questionResult = await client.query(
      'SELECT * FROM questions WHERE id = $1',
      [req.params.id]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const question = questionResult.rows[0];

    // Check ownership or admin role
    if (question.faculty_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Build update query
    let updates = [];
    let values = [];
    let paramCount = 1;

    if (questionText) {
      updates.push(`question_text = $${paramCount}`);
      values.push(questionText);
      paramCount++;
    }

    if (options) {
      updates.push(`options = $${paramCount}`);
      values.push(JSON.stringify(options));
      paramCount++;
    }

    if (correctOptionIndex !== undefined) {
      updates.push(`correct_option_index = $${paramCount}`);
      values.push(correctOptionIndex);
      paramCount++;
    }

    if (marks) {
      updates.push(`marks = $${paramCount}`);
      values.push(marks);
      paramCount++;
    }

    if (difficulty) {
      updates.push(`difficulty = $${paramCount}`);
      values.push(difficulty);
      paramCount++;
    }

    if (subject) {
      updates.push(`subject = $${paramCount}`);
      values.push(subject);
      paramCount++;
    }

    if (topic) {
      updates.push(`topic = $${paramCount}`);
      values.push(topic);
      paramCount++;
    }

    // Only admin can approve questions
    if (req.user.role === 'admin' && isApproved !== undefined) {
      updates.push(`is_approved = $${paramCount}`);
      values.push(isApproved);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    values.push(req.params.id);
    const updateQuery = `
      UPDATE questions 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await client.query(updateQuery, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  const client = await pool.connect();

  try {
    // Get the question
    const questionResult = await client.query(
      'SELECT * FROM questions WHERE id = $1',
      [req.params.id]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const question = questionResult.rows[0];

    // Check ownership or admin role
    if (question.faculty_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete the question
    await client.query(
      'DELETE FROM questions WHERE id = $1',
      [req.params.id]
    );

    res.json({ message: 'Question removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
}; 