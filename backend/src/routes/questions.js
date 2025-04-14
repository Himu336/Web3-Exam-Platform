const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const questionController = require('../controllers/questionController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleAuth');

// @route   POST api/questions
// @desc    Create a question
// @access  Private (Faculty)
router.post(
  '/',
  [
    auth,
    checkRole('faculty', 'admin'),
    [
      check('questionText', 'Question text is required').not().isEmpty(),
      check('options', 'Options array is required').isArray({ min: 2 }),
      check('correctOptionIndex', 'Correct option index is required').isNumeric(),
      check('subject', 'Subject is required').not().isEmpty(),
      check('topic', 'Topic is required').not().isEmpty()
    ]
  ],
  questionController.createQuestion
);

// @route   GET api/questions/me
// @desc    Get all questions by faculty
// @access  Private (Faculty)
router.get('/me', auth, checkRole('faculty'), questionController.getQuestionsByFaculty);

// @route   GET api/questions
// @desc    Get all questions
// @access  Private (Admin)
router.get('/', auth, checkRole('admin'), questionController.getAllQuestions);

// @route   GET api/questions/faculty/:facultyId
// @desc    Get questions by faculty ID
// @access  Private (Admin)
router.get('/faculty/:facultyId', auth, checkRole('admin'), questionController.getQuestionsByFacultyId);

// @route   PUT api/questions/:id
// @desc    Update question
// @access  Private (Faculty, Admin)
router.put(
  '/:id',
  [
    auth,
    checkRole('faculty', 'admin'),
    [
      check('questionText', 'Question text is required').optional(),
      check('options', 'Options must be an array').optional().isArray(),
      check('correctOptionIndex', 'Correct option index must be numeric').optional().isNumeric()
    ]
  ],
  questionController.updateQuestion
);

// @route   DELETE api/questions/:id
// @desc    Delete question
// @access  Private (Faculty, Admin)
router.delete('/:id', auth, checkRole('faculty', 'admin'), questionController.deleteQuestion);

module.exports = router; 