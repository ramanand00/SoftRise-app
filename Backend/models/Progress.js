const mongoose = require('mongoose')

const lessonProgressSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  completionTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started',
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0,
  },
  lastPosition: {
    type: Number, // video position in seconds
    default: 0,
  },
  notes: [{
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  quizAttempts: [{
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    answers: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      selectedAnswer: {
        type: mongoose.Schema.Mixed,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    }],
  }],
});

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  lastAccessDate: {
    type: Date,
    default: Date.now,
  },
  lessonsProgress: [lessonProgressSchema],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  totalTimeSpent: {
    type: Number, // in minutes
    default: 0,
  },
  status: {
    type: String,
    enum: ['enrolled', 'in-progress', 'completed', 'inactive'],
    default: 'enrolled',
  },
  certificateIssued: {
    type: Boolean,
    default: false,
  },
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
  },
  examAttempts: [{
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
    },
    attemptDate: {
      type: Date,
      default: Date.now,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      default: false,
    },
  }],
  achievements: [{
    type: {
      type: String,
      enum: [
        'course_started',
        'first_lesson_completed',
        'half_way',
        'all_lessons_completed',
        'course_completed',
        'perfect_quiz_score',
        'fast_learner',
        'consistent_learner',
      ],
    },
    earnedDate: {
      type: Date,
      default: Date.now,
    },
    description: String,
  }],
}, { timestamps: true })

// Update overall progress when lesson progress changes
progressSchema.pre('save', function(next) {
  if (this.lessonsProgress.length > 0) {
    const completedLessons = this.lessonsProgress.filter(
      lesson => lesson.status === 'completed'
    ).length;
    
    this.overallProgress = (completedLessons / this.lessonsProgress.length) * 100;
    
    // Update status based on progress
    if (this.overallProgress === 100) {
      this.status = 'completed';
    } else if (this.overallProgress > 0) {
      this.status = 'in-progress';
    }
  }
  next();
});

// Update total time spent
progressSchema.pre('save', function(next) {
  if (this.lessonsProgress.length > 0) {
    this.totalTimeSpent = this.lessonsProgress.reduce(
      (total, lesson) => total + (lesson.timeSpent || 0),
      0
    );
  }
  next();
});

// Instance method to update lesson progress
progressSchema.methods.updateLessonProgress = async function(lessonId, updates) {
  const lessonProgress = this.lessonsProgress.find(
    lp => lp.lesson.toString() === lessonId.toString()
  );
  
  if (!lessonProgress) return null;
  
  Object.assign(lessonProgress, updates);
  
  if (updates.status === 'completed' && !lessonProgress.completionTime) {
    lessonProgress.completionTime = new Date();
  }
  
  await this.save();
  return lessonProgress;
};

// Instance method to check achievement eligibility
progressSchema.methods.checkAchievements = async function() {
  const newAchievements = [];
  
  // Course started
  if (!this.achievements.find(a => a.type === 'course_started')) {
    newAchievements.push({
      type: 'course_started',
      description: 'Started the course journey',
    });
  }
  
  // First lesson completed
  if (this.lessonsProgress.some(lp => lp.status === 'completed') &&
      !this.achievements.find(a => a.type === 'first_lesson_completed')) {
    newAchievements.push({
      type: 'first_lesson_completed',
      description: 'Completed first lesson',
    });
  }
  
  // Half way
  if (this.overallProgress >= 50 &&
      !this.achievements.find(a => a.type === 'half_way')) {
    newAchievements.push({
      type: 'half_way',
      description: 'Reached halfway point',
    });
  }
  
  // Course completed
  if (this.overallProgress === 100 &&
      !this.achievements.find(a => a.type === 'course_completed')) {
    newAchievements.push({
      type: 'course_completed',
      description: 'Successfully completed the course',
    });
  }
  
  if (newAchievements.length > 0) {
    this.achievements.push(...newAchievements);
    await this.save();
  }
  
  return newAchievements;
};

// Static method to get user progress summary
progressSchema.statics.getUserProgressSummary = async function(userId) {
  const progress = await this.find({ user: userId })
    .populate('course', 'title category')
    .select('overallProgress status totalTimeSpent');
  
  return {
    coursesEnrolled: progress.length,
    coursesCompleted: progress.filter(p => p.status === 'completed').length,
    averageProgress: progress.reduce((acc, curr) => acc + curr.overallProgress, 0) / progress.length,
    totalTimeSpent: progress.reduce((acc, curr) => acc + curr.totalTimeSpent, 0),
  };
};

const Progress = mongoose.model('Progress', progressSchema)

module.exports = Progress 