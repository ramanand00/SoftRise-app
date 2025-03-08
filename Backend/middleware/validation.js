const { body, validationResult } = require('express-validator');

// User validation rules
const userValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
    body('firstName')
      .trim()
      .isLength({ min: 2 })
      .withMessage('First name must be at least 2 characters long'),
    body('lastName')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Last name must be at least 2 characters long'),
  ];
};

// Course validation rules
const courseValidationRules = () => {
  return [
    body('title')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Title must be at least 5 characters long'),
    body('description')
      .trim()
      .isLength({ min: 20 })
      .withMessage('Description must be at least 20 characters long'),
    body('category')
      .isIn([
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Cloud Computing',
        'Artificial Intelligence',
        'Cybersecurity',
        'DevOps',
        'UI/UX Design',
      ])
      .withMessage('Invalid category'),
    body('level')
      .isIn(['Beginner', 'Intermediate', 'Advanced'])
      .withMessage('Invalid level'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
  ];
};

// Lesson validation rules
const lessonValidationRules = () => {
  return [
    body('title')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Title must be at least 5 characters long'),
    body('description')
      .trim()
      .isLength({ min: 20 })
      .withMessage('Description must be at least 20 characters long'),
    body('content.type')
      .isIn(['video', 'document', 'quiz'])
      .withMessage('Invalid content type'),
    body('order')
      .isInt({ min: 0 })
      .withMessage('Order must be a positive number'),
  ];
};

// Quiz validation rules
const quizValidationRules = () => {
  return [
    body('questions.*.question')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Question must be at least 10 characters long'),
    body('questions.*.options')
      .isArray({ min: 2 })
      .withMessage('At least 2 options are required'),
    body('questions.*.correctAnswer')
      .isInt({ min: 0 })
      .withMessage('Correct answer must be a valid option index'),
  ];
};

// Progress update validation rules
const progressUpdateValidationRules = () => {
  return [
    body('lessonId')
      .isMongoId()
      .withMessage('Invalid lesson ID'),
    body('status')
      .isIn(['not-started', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
    body('timeSpent')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Time spent must be a positive number'),
    body('lastPosition')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Last position must be a positive number'),
  ];
};

// Rating validation rules
const ratingValidationRules = () => {
  return [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('review')
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage('Review must be at least 10 characters long'),
  ];
};

// Password reset validation rules
const passwordResetValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('token')
      .optional()
      .isLength({ min: 20 })
      .withMessage('Invalid reset token'),
    body('newPassword')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
  ];
};

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  userValidationRules,
  courseValidationRules,
  lessonValidationRules,
  quizValidationRules,
  progressUpdateValidationRules,
  ratingValidationRules,
  passwordResetValidationRules,
  validate,
}; 