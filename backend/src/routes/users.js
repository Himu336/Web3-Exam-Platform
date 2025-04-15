const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleAuth');

// @route   GET api/users
// @desc    Get all users (with filtering)
// @access  Private (Admin)
router.get('/', auth, checkRole('admin'), userController.getAllUsers);

// @route   GET api/users/stats
// @desc    Get dashboard stats
// @access  Private (Admin)
router.get('/stats', auth, checkRole('admin'), userController.getDashboardStats);

// @route   GET api/users/faculty
// @desc    Get all faculty members
// @access  Private (Admin)
router.get('/faculty', auth, checkRole('admin'), async (req, res) => {
  req.query.role = 'faculty';
  userController.getAllUsers(req, res);
});

// @route   GET api/users/students
// @desc    Get all students
// @access  Private (Admin, Faculty)
router.get('/students', auth, checkRole('admin', 'faculty'), async (req, res) => {
  req.query.role = 'student';
  userController.getAllUsers(req, res);
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private (Admin)
router.get('/:id', auth, checkRole('admin'), userController.getUserById);

// @route   POST api/users
// @desc    Create a new user
// @access  Private (Admin)
router.post(
  '/', 
  [
    auth,
    checkRole('admin'),
    [
      check('username', 'Username is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
      check('role', 'Role is required').not().isEmpty()
    ]
  ],
  userController.createUser
);

// @route   PUT api/users/:id
// @desc    Update a user
// @access  Private (Admin)
router.put(
  '/:id',
  [
    auth,
    checkRole('admin'),
    [
      check('username', 'Username is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('role', 'Role is required').not().isEmpty()
    ]
  ],
  userController.updateUser
);

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Private (Admin)
router.delete('/:id', auth, checkRole('admin'), userController.deleteUser);

module.exports = router; 