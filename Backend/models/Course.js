const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: {
      type: String,
      enum: ['video', 'document', 'quiz'],
      required: true,
    },
    videoUrl: String,
    documentUrl: String,
    duration: Number, // in minutes
    quiz: {
      questions: [{
        question: {
          type: String,
          required: true,
        },
        options: [{
          type: String,
          required: true,
        }],
        correctAnswer: {
          type: Number,
          required: true,
        },
        explanation: String,
      }],
    },
  },
  order: {
    type: Number,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
})

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Cloud Computing',
      'Artificial Intelligence',
      'Cybersecurity',
      'DevOps',
      'UI/UX Design',
    ],
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  },
  prerequisites: [{
    type: String,
    trim: true,
  }],
  learningOutcomes: [{
    type: String,
    trim: true,
  }],
  lessons: [lessonSchema],
  duration: {
    type: Number, // Total duration in minutes
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    completedLessons: [{
      lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
      completedAt: {
        type: Date,
        default: Date.now,
      },
      quizScore: Number,
    }],
    progress: {
      type: Number,
      default: 0,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: String,
    trim: true,
  }],
}, { timestamps: true })

// Calculate average rating before saving
courseSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = totalRating / this.ratings.length;
    this.totalRatings = this.ratings.length;
  }
  next();
});

// Calculate total duration before saving
courseSchema.pre('save', function(next) {
  if (this.lessons.length > 0) {
    this.duration = this.lessons.reduce((acc, curr) => {
      return acc + (curr.content.duration || 0);
    }, 0);
  }
  next();
});

// Generate course slug
courseSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');
  next();
});

const Course = mongoose.model('Course', courseSchema)

module.exports = Course 