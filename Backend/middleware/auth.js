const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Course = require('../models/Course')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      throw new Error()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      throw new Error()
    }

    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' })
  }
}

const isInstructor = async (req, res, next) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ error: 'Access denied. Instructor role required.' })
    }
    next()
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' })
    }
    next()
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

const isEmailVerified = async (req, res, next) => {
  try {
    if (!req.user.isEmailVerified) {
      return res.status(403).json({
        error: 'Email not verified',
        message: 'Please verify your email address to access this feature.'
      })
    }
    next()
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

const isCourseEnrolled = async (req, res, next) => {
  try {
    const courseId = req.params.courseId
    const isEnrolled = req.user.enrolledCourses.some(
      course => course.course.toString() === courseId
    )

    if (!isEnrolled) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You must be enrolled in this course to access this resource.'
      })
    }
    next()
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

const isCourseInstructor = async (req, res, next) => {
  try {
    const courseId = req.params.courseId
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You must be the course instructor to perform this action.'
      })
    }
    next()
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  auth,
  isInstructor,
  isAdmin,
  isEmailVerified,
  isCourseEnrolled,
  isCourseInstructor,
} 