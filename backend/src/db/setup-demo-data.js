require('dotenv').config();
const { pool } = require('../config/db');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

async function setupDemoData() {
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');

    logger.info('Setting up demo data...');

    // Get admin, faculty and student users
    const usersResult = await client.query(
      `SELECT id, username, role FROM users 
       WHERE username IN ('admin', 'faculty', 'student')`
    );
    
    const users = {};
    usersResult.rows.forEach(user => {
      users[user.username] = user;
    });

    // Create sample questions if they don't exist
    const questionsCount = await client.query('SELECT COUNT(*) FROM questions');
    
    if (parseInt(questionsCount.rows[0].count) === 0) {
      logger.info('Creating sample questions...');
      
      // Sample questions for demo
      const sampleQuestions = [
        {
          question_text: 'What is the time complexity of binary search?',
          options: JSON.stringify([
            { text: 'O(1)' },
            { text: 'O(log n)' },
            { text: 'O(n)' },
            { text: 'O(n log n)' }
          ]),
          correct_option_index: 1,
          subject: 'Data Structures',
          topic: 'Algorithms',
          faculty_id: users.faculty?.id || 1,
          is_approved: true,
          status: 'approved'
        },
        {
          question_text: 'Which data structure is used to implement recursion?',
          options: JSON.stringify([
            { text: 'Array' },
            { text: 'Queue' },
            { text: 'Stack' },
            { text: 'List' }
          ]),
          correct_option_index: 2,
          subject: 'Data Structures',
          topic: 'Stacks & Queues',
          faculty_id: users.faculty?.id || 1,
          is_approved: true,
          status: 'approved'
        },
        {
          question_text: 'What is the default type of SQL JOIN?',
          options: JSON.stringify([
            { text: 'INNER JOIN' },
            { text: 'LEFT JOIN' },
            { text: 'RIGHT JOIN' },
            { text: 'FULL JOIN' }
          ]),
          correct_option_index: 0,
          subject: 'Database',
          topic: 'SQL',
          faculty_id: users.faculty?.id || 1,
          is_approved: true,
          status: 'approved'
        }
      ];

      for (const question of sampleQuestions) {
        await client.query(
          `INSERT INTO questions 
           (question_text, options, correct_option_index, subject, topic, faculty_id, is_approved, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            question.question_text,
            question.options,
            question.correct_option_index,
            question.subject,
            question.topic,
            question.faculty_id,
            question.is_approved,
            question.status
          ]
        );
      }
      
      logger.info('Sample questions created successfully');
    }

    // Verify questions exist before proceeding
    const questionCheckResult = await client.query('SELECT COUNT(*) FROM questions');
    const questionCount = parseInt(questionCheckResult.rows[0].count);

    if (questionCount === 0) {
      logger.error('Cannot proceed with exam creation: No questions available');
      throw new Error('Questions must be created before exams');
    }

    // Create sample exams if they don't exist
    const examsCount = await client.query('SELECT COUNT(*) FROM exams');
    
    if (parseInt(examsCount.rows[0].count) === 0) {
      logger.info('Creating sample exams...');
      
      // Current date and future dates for exams
      const now = new Date();
      const oneWeekLater = new Date(now);
      oneWeekLater.setDate(now.getDate() + 7);
      
      const twoWeeksLater = new Date(now);
      twoWeeksLater.setDate(now.getDate() + 14);
      
      // Sample exams
      const sampleExams = [
        {
          title: 'Data Structures Mid-term',
          description: 'Mid-term examination covering arrays, linked lists, stacks, and queues.',
          duration: 120, // 2 hours
          total_marks: 50,
          start_time: now,
          end_time: oneWeekLater,
          is_active: true,
          created_by: users.admin?.id || 1
        },
        {
          title: 'Database Systems Final',
          description: 'Final examination covering SQL, normalization, and indexing.',
          duration: 180, // 3 hours
          total_marks: 100,
          start_time: oneWeekLater,
          end_time: twoWeeksLater,
          is_active: false,
          created_by: users.admin?.id || 1
        }
      ];

      for (const exam of sampleExams) {
        const examResult = await client.query(
          `INSERT INTO exams 
           (title, description, duration, total_marks, start_time, end_time, is_active, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id`,
          [
            exam.title,
            exam.description,
            exam.duration,
            exam.total_marks,
            exam.start_time,
            exam.end_time,
            exam.is_active,
            exam.created_by
          ]
        );
        
        const examId = examResult.rows[0].id;
        
        // Get questions 
        const questionsResult = await client.query(
          'SELECT id FROM questions LIMIT $1',
          [2] // Fixed to 2 questions per exam instead of exam.total_questions
        );
        
        // Add questions to exam
        for (const question of questionsResult.rows) {
          await client.query(
            'INSERT INTO exam_questions (exam_id, question_id, marks) VALUES ($1, $2, $3)',
            [examId, question.id, exam.total_marks / questionsResult.rows.length]
          );
        }
        
        // Add faculty to exam
        if (users.faculty) {
          await client.query(
            'INSERT INTO exam_faculties (exam_id, faculty_id) VALUES ($1, $2)',
            [examId, users.faculty.id]
          );
        }
      }
      
      logger.info('Sample exams created successfully');
    }

    // Create sample results if they don't exist
    const resultsCount = await client.query('SELECT COUNT(*) FROM results');
    
    if (parseInt(resultsCount.rows[0].count) === 0 && users.student) {
      logger.info('Creating sample results...');
      
      // Get the first exam
      const examResult = await client.query('SELECT id, total_marks FROM exams LIMIT 1');
      
      if (examResult.rows.length > 0) {
        const exam = examResult.rows[0];
        
        // Create a result record
        const resultResult = await client.query(
          `INSERT INTO results 
           (student_id, exam_id, total_marks, max_marks, percentage, status, submitted_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id`,
          [
            users.student.id,
            exam.id,
            40, // assuming 40 out of 50
            exam.total_marks,
            (40 / exam.total_marks) * 100,
            'completed',
            new Date()
          ]
        );
        
        const resultId = resultResult.rows[0].id;
        
        // Get exam questions
        const examQuestionsResult = await client.query(
          `SELECT q.id, eq.marks 
           FROM questions q
           JOIN exam_questions eq ON q.id = eq.question_id
           WHERE eq.exam_id = $1`,
          [exam.id]
        );
        
        // Add answers
        for (const [index, question] of examQuestionsResult.rows.entries()) {
          await client.query(
            `INSERT INTO answers
             (result_id, question_id, selected_option, is_correct, marks)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              resultId,
              question.id,
              index === 0 ? 1 : 2, // correct answer for first question, wrong for second
              index === 0,
              index === 0 ? question.marks : 0
            ]
          );
        }
        
        logger.info('Sample results created successfully');
      }
    }

    // Commit transaction
    await client.query('COMMIT');
    logger.info('Demo data setup completed successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Demo data setup error: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDemoData()
    .then(() => {
      logger.info('Demo data setup completed. Exiting...');
      process.exit(0);
    })
    .catch(err => {
      logger.error(`Demo data setup failed: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { setupDemoData }; 