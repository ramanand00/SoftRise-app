const mongoose = require('mongoose')

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    lessonId: String,
    completedAt: Date,
    timeSpent: Number
  }],
  lastAccessed: Date,
  progress: {
    type: Number,
    default: 0
  },
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: Date,
    certificateUrl: String
  }
}, { timestamps: true })

module.exports = mongoose.model('Progress', progressSchema) 