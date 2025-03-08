const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  content: [{
    title: String,
    videoUrl: String,
    duration: Number,
    description: String,
  }],
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: Number,
    review: String,
  }],
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema) 