const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

// Submit exam results
exports.submitExam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const client = await pool.connect();

  try {
    const { examId, answers } = req.body;

    await client.query('BEGIN');

    // Check if exam exists
    const examResult = await client.query(
      'SELECT * FROM exams WHERE id = $1',
      [examId]
    );
    
    if (examResult.rows.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if student has already submitted
    const existingResult = await client.query(
      'SELECT * FROM results WHERE student_id = $1 AND exam_id = $2',
      [req.user.id, examId]
    );
    
    let resultId;
    let totalMarks = 0;

    if (existingResult.rows.length > 0 && existingResult.rows[0].status !== 'pending') {
      return res.status(400).json({ message: 'Exam already submitted' });
    } else if (existingResult.rows.length > 0) {
      resultId = existingResult.rows[0].id;
      // Delete existing answers
      await client.query('DELETE FROM answers WHERE result_id = $1', [resultId]);
    } else {
      // Create new result
      const resultInsert = await client.query(
        `INSERT INTO results (student_id, exam_id, status, submitted_at)
         VALUES ($1, $2, 'completed', NOW())
         RETURNING id`,
        [req.user.id, examId]
      );
      resultId = resultInsert.rows[0].id;
    }

    // Process answers
    for (const answer of answers) {
      // Get question details
      const questionResult = await client.query(
        'SELECT * FROM questions WHERE id = $1',
        [answer.questionId]
      );
      
      if (questionResult.rows.length === 0) continue;
      
      const question = questionResult.rows[0];
      const isCorrect = question.correct_option_index === answer.selectedOption;
      const marks = isCorrect ? question.marks : 0;
      totalMarks += marks;

      // Save answer
      await client.query(
        `INSERT INTO answers (result_id, question_id, selected_option, is_correct, marks)
         VALUES ($1, $2, $3, $4, $5)`,
        [resultId, answer.questionId, answer.selectedOption, isCorrect, marks]
      );
    }

    // Update total marks
    await client.query(
      'UPDATE results SET total_marks = $1, status = $2 WHERE id = $3',
      [totalMarks, 'completed', resultId]
    );

    await client.query('COMMIT');

    // Get the updated result
    const updatedResult = await client.query(
      'SELECT * FROM results WHERE id = $1',
      [resultId]
    );

    res.status(201).json(updatedResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Get student's results
exports.getStudentResults = async (req, res) => {
  const client = await pool.connect();

  try {
    const results = await client.query(
      `SELECT r.*, e.title, e.description, e.total_marks as exam_total_marks
       FROM results r
       JOIN exams e ON r.exam_id = e.id
       WHERE r.student_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    
    res.json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Get all results (for faculty/admin)
exports.getAllResults = async (req, res) => {
  const client = await pool.connect();

  try {
    const results = await client.query(
      `SELECT r.*, 
          e.title, e.description, e.total_marks as exam_total_marks,
          u.username as student_name, u.email as student_email
       FROM results r
       JOIN exams e ON r.exam_id = e.id
       JOIN users u ON r.student_id = u.id
       ORDER BY r.created_at DESC`
    );
    
    res.json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// Validate/update a result (for faculty)
exports.validateResult = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const client = await pool.connect();

  try {
    const { answers, totalMarks } = req.body;

    await client.query('BEGIN');

    // Find the result
    const resultResult = await client.query(
      'SELECT * FROM results WHERE id = $1',
      [req.params.id]
    );
    
    if (resultResult.rows.length === 0) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Update answers if provided
    if (answers && answers.length > 0) {
      for (const answer of answers) {
        await client.query(
          `UPDATE answers SET marks = $1, is_correct = $2
           WHERE result_id = $3 AND question_id = $4`,
          [answer.marks, answer.marks > 0, req.params.id, answer.questionId]
        );
      }
    }

    // Update total marks
    let finalTotalMarks = totalMarks;
    if (finalTotalMarks === undefined) {
      // Recalculate total marks
      const marksResult = await client.query(
        'SELECT SUM(marks) as total FROM answers WHERE result_id = $1',
        [req.params.id]
      );
      finalTotalMarks = marksResult.rows[0].total || 0;
    }

    // Update result
    await client.query(
      `UPDATE results 
       SET total_marks = $1, status = 'validated', validated_by = $2
       WHERE id = $3`,
      [finalTotalMarks, req.user.id, req.params.id]
    );

    await client.query('COMMIT');

    // Get updated result
    const updatedResult = await client.query(
      'SELECT * FROM results WHERE id = $1',
      [req.params.id]
    );
    
    res.json(updatedResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
}; 