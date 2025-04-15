const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const examController = require('../controllers/examController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleAuth');

// @route   POST api/exams
// @desc    Create an exam
// @access  Private (Admin)
router.post(
  '/',
  [
    auth,
    checkRole('admin'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('duration', 'Duration is required').isNumeric(),
      check('totalMarks', 'Total marks is required').isNumeric(),
      check('startTime', 'Start time is required').not().isEmpty(),
      check('endTime', 'End time is required').not().isEmpty()
    ]
  ],
  examController.createExam
);

// @route   GET api/exams
// @desc    Get all exams
// @access  Private (Admin, Faculty)
router.get('/', auth, checkRole('admin', 'faculty'), examController.getAllExams);

// @route   GET api/exams/:id
// @desc    Get exam by ID
// @access  Private (All authenticated)
router.get('/:id', auth, examController.getExamById);

// @route   PUT api/exams/:id
// @desc    Update exam
// @access  Private (Admin)
router.put(
  '/:id',
  [
    auth,
    checkRole('admin'),
    [
      check('title', 'Title is required').optional(),
      check('duration', 'Duration must be numeric').optional().isNumeric(),
      check('totalMarks', 'Total marks must be numeric').optional().isNumeric()
    ]
  ],
  examController.updateExam
);

// @route   DELETE api/exams/:id
// @desc    Delete exam
// @access  Private (Admin)
router.delete('/:id', auth, checkRole('admin'), examController.deleteExam);

// @route   POST api/exams/questions
// @desc    Get questions by faculty IDs for exam creation
// @access  Private (Admin)
router.post('/questions', auth, checkRole('admin'), examController.getQuestionsByFaculties);

module.exports = router; 