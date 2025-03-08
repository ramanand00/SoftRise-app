const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')

// Get user profile
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('connections', 'name avatar')
      .populate('enrolledCourses.course')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    const {
      name,
      bio,
      avatar,
      skills,
      education,
      interests,
    } = req.body

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update fields
    if (name) user.name = name
    if (bio) user.bio = bio
    if (avatar) user.avatar = avatar
    if (skills) user.skills = skills
    if (education) user.education = education
    if (interests) user.interests = interests

    await user.save()

    res.json(user)
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Add connection
router.post('/connect/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    const targetUser = await User.findById(req.params.userId)

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.connections.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Already connected' })
    }

    user.connections.push(req.params.userId)
    targetUser.connections.push(req.user.userId)

    await Promise.all([user.save(), targetUser.save()])

    res.json({ message: 'Connection added successfully' })
  } catch (error) {
    console.error('Error adding connection:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router 