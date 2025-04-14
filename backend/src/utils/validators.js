const { body } = require('express-validator');

// Question validation rules
const questionValidationRules = () => {
  return [
    body('questionText').notEmpty().withMessage('Question text is required'),
    body('options').isArray({ min: 2 }).withMessage('At least 2 options are required'),
    body('correctOptionIndex').isNumeric().withMessage('Correct option index must be numeric'),
    body('marks').optional().isNumeric().withMessage('Marks must be numeric'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('topic').notEmpty().withMessage('Topic is required')
  ];
};

// Exam validation rules
const examValidationRules = () => {
  return [
    body('title').notEmpty().withMessage('Title is required'),
    body('duration').isNumeric().withMessage('Duration must be numeric'),
    body('totalMarks').isNumeric().withMessage('Total marks must be numeric'),
    body('questions').optional().isArray().withMessage('Questions must be an array'),
    body('faculties').optional().isArray().withMessage('Faculties must be an array'),
    body('startTime').isISO8601().withMessage('Start time must be a valid date'),
    body('endTime').isISO8601().withMessage('End time must be a valid date')
  ];
};

module.exports = {
  questionValidationRules,
  examValidationRules
}; 