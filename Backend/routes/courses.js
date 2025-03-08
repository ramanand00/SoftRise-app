const express = require('express')
const router = express.Router()
const Course = require('../models/Course')
const auth = require('../middleware/auth')

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query
    let query = {}

    if (category && category !== 'all') {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .select('-content')
    res.json(courses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar')
      .populate('ratings.user', 'name avatar')
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    
    res.json(course)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create course (instructors only)
router.post('/', auth, async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      instructor: req.user.userId,
    })
    await course.save()
    res.status(201).json(course)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    if (course.enrolledStudents.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already enrolled' })
    }

    course.enrolledStudents.push(req.user.userId)
    await course.save()
    
    res.json({ message: 'Enrolled successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router 