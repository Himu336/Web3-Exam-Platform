const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

// Create a new exam
exports.createExam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const client = await pool.connect();

  try {
    const { title, description, duration, totalMarks, faculties, questions, startTime, endTime } = req.body;

    await client.query('BEGIN');

    // Insert exam
    const examResult = await client.query(
      `INSERT INTO exams 
        (title, description, duration, total_marks, start_time, end_time, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, description, duration, totalMarks, startTime, endTime, req.user.id]
    );

    const exam = examResult.rows[0];
    
    // Add faculties to exam
    if (faculties && faculties.length > 0) {
      const facultyValues = faculties.map(facultyId => {
        return `(${exam.id}, ${facultyId})`;
      }).join(', ');
      
      await client.query(`
        INSERT INTO exam_faculties (exam_id, faculty_id)
        VALUES ${facultyValues}
      `);
    }

    // Add questions to exam
    if (questions && questions.length > 0) {
      const questionValues = questions.map(q => {
        return `(${exam.id}, ${q.question}, ${q.marks || 1})`;
      }).join(', ');
      
      await client.query(`
        INSERT INTO exam_questions (exam_id, question_id, marks)
        VALUES ${questionValues}
      `);
    }

    await client.query('COMMIT');

    res.status(201).json(exam);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT 
        e.*,
        u.username as creator_username,
        u.email as creator_email,
        ARRAY(
          SELECT json_build_object('id', f.id, 'username', f.username, 'email', f.email, 'department', f.department)
          FROM exam_faculties ef
          JOIN users f ON ef.faculty_id = f.id
          WHERE ef.exam_id = e.id
        ) as faculties
      FROM exams e
      JOIN users u ON e.created_by = u.id
      ORDER BY e.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  const client = await pool.connect();

  try {
    // Get exam with creator and faculties
    const examResult = await client.query(`
      SELECT 
        e.*,
        u.username as creator_username,
        u.email as creator_email,
        ARRAY(
          SELECT json_build_object('id', f.id, 'username', f.username, 'email', f.email, 'department', f.department)
          FROM exam_faculties ef
          JOIN users f ON ef.faculty_id = f.id
          WHERE ef.exam_id = e.id
        ) as faculties
      FROM exams e
      JOIN users u ON e.created_by = u.id
      WHERE e.id = $1
    `, [req.params.id]);
    
    if (examResult.rows.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const exam = examResult.rows[0];

    // Get questions
    const questionsResult = await client.query(`
      SELECT 
        eq.question_id,
        eq.marks,
        q.question_text,
        q.options
        ${req.user.role !== 'student' ? ', q.correct_option_index' : ''}
      FROM exam_questions eq
      JOIN questions q ON eq.question_id = q.id
      WHERE eq.exam_id = $1
    `, [exam.id]);

    exam.questions = questionsResult.rows;
    
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Update exam
exports.updateExam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const client = await pool.connect();

  try {
    const { title, description, duration, totalMarks, faculties, questions, startTime, endTime, isActive } = req.body;

    // Get the exam
    const examResult = await client.query(
      'SELECT * FROM exams WHERE id = $1',
      [req.params.id]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    let exam = examResult.rows[0];

    // Only admin or creator can update exam
    if (exam.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await client.query('BEGIN');

    // Build update query
    let updates = [];
    let values = [];
    let paramCount = 1;

    if (title) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }

    if (description) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (duration) {
      updates.push(`duration = $${paramCount}`);
      values.push(duration);
      paramCount++;
    }

    if (totalMarks) {
      updates.push(`total_marks = $${paramCount}`);
      values.push(totalMarks);
      paramCount++;
    }

    if (startTime) {
      updates.push(`start_time = $${paramCount}`);
      values.push(startTime);
      paramCount++;
    }

    if (endTime) {
      updates.push(`end_time = $${paramCount}`);
      values.push(endTime);
      paramCount++;
    }

    if (isActive !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      values.push(isActive);
      paramCount++;
    }

    if (updates.length > 0) {
      values.push(req.params.id);
      const updateQuery = `
        UPDATE exams 
        SET ${updates.join(', ')} 
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const updateResult = await client.query(updateQuery, values);
      exam = updateResult.rows[0];
    }

    // Update faculties
    if (faculties) {
      // Delete existing faculties
      await client.query('DELETE FROM exam_faculties WHERE exam_id = $1', [exam.id]);
      
      // Add new faculties
      if (faculties.length > 0) {
        const facultyValues = faculties.map(facultyId => {
          return `(${exam.id}, ${facultyId})`;
        }).join(', ');
        
        await client.query(`
          INSERT INTO exam_faculties (exam_id, faculty_id)
          VALUES ${facultyValues}
        `);
      }
    }

    // Update questions
    if (questions) {
      // Delete existing questions
      await client.query('DELETE FROM exam_questions WHERE exam_id = $1', [exam.id]);
      
      // Add new questions
      if (questions.length > 0) {
        const questionValues = questions.map(q => {
          return `(${exam.id}, ${q.question}, ${q.marks || 1})`;
        }).join(', ');
        
        await client.query(`
          INSERT INTO exam_questions (exam_id, question_id, marks)
          VALUES ${questionValues}
        `);
      }
    }

    await client.query('COMMIT');
    
    res.json(exam);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Delete exam
exports.deleteExam = async (req, res) => {
  const client = await pool.connect();

  try {
    // Get the exam
    const examResult = await client.query(
      'SELECT * FROM exams WHERE id = $1',
      [req.params.id]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const exam = examResult.rows[0];

    // Only admin or creator can delete exam
    if (exam.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete the exam (cascade will handle related records)
    await client.query(
      'DELETE FROM exams WHERE id = $1',
      [req.params.id]
    );

    res.json({ message: 'Exam removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Get questions by faculty for exam creation
exports.getQuestionsByFaculties = async (req, res) => {
  const client = await pool.connect();

  try {
    const { facultyIds } = req.body;
    
    if (!facultyIds || !Array.isArray(facultyIds) || facultyIds.length === 0) {
      return res.status(400).json({ message: 'Faculty IDs are required' });
    }

    // Convert array to PostgreSQL format
    const facultyList = facultyIds.join(',');
    
    const result = await client.query(`
      SELECT q.*, u.username, u.email, u.department 
      FROM questions q
      JOIN users u ON q.faculty_id = u.id
      WHERE q.faculty_id IN (${facultyList})
      AND q.is_approved = true
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
}; 