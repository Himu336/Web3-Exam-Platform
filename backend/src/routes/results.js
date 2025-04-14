const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const resultController = require('../controllers/resultController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleAuth');

// @route   POST api/results
// @desc    Submit exam results
// @access  Private (Student)
router.post(
  '/',
  [
    auth,
    checkRole('student'),
    [
      check('examId', 'Exam ID is required').not().isEmpty(),
      check('answers', 'Answers are required').isArray()
    ]
  ],
  resultController.submitExam
);

// @route   GET api/results/me
// @desc    Get student's results
// @access  Private (Student)
router.get('/me', auth, checkRole('student'), resultController.getStudentResults);

// @route   GET api/results
// @desc    Get all results
// @access  Private (Faculty, Admin)
router.get('/', auth, checkRole('faculty', 'admin'), resultController.getAllResults);

// @route   PUT api/results/:id
// @desc    Validate/update a result
// @access  Private (Faculty, Admin)
router.put(
  '/:id',
  [
    auth,
    checkRole('faculty', 'admin'),
    [
      check('answers', 'Answers must be an array').optional().isArray(),
      check('totalMarks', 'Total marks must be numeric').optional().isNumeric()
    ]
  ],
  resultController.validateResult
);

module.exports = router; 