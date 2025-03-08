const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'essay'],
    required: true,
  },
  options: [{
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  }],
  explanation: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
    default: 1,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  tags: [{
    type: String,
  }],
});

const examSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['final', 'quiz', 'practice'],
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  passingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 80, // 80% passing score for certificate
  },
  totalPoints: {
    type: Number,
    required: true,
  },
  questions: [questionSchema],
  instructions: {
    type: String,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  attempts: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    answers: [{
      question: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      selectedOptions: [{
        type: Number,
      }],
      essayAnswer: {
        type: String,
      },
      isCorrect: {
        type: Boolean,
      },
      pointsEarned: {
        type: Number,
        default: 0,
      },
    }],
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    feedback: {
      type: String,
    },
  }],
  settings: {
    shuffleQuestions: {
      type: Boolean,
      default: true,
    },
    shuffleOptions: {
      type: Boolean,
      default: true,
    },
    showResults: {
      type: Boolean,
      default: true,
    },
    showExplanations: {
      type: Boolean,
      default: true,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    timeLimit: {
      type: Number, // in minutes
      required: true,
    },
  },
}, {
  timestamps: true,
});

// Calculate total points before saving
examSchema.pre('save', function(next) {
  if (this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((acc, curr) => acc + curr.points, 0);
  }
  next();
});

// Instance method to check if student can attempt exam
examSchema.methods.canAttempt = function(studentId) {
  const studentAttempts = this.attempts.filter(
    attempt => attempt.student.toString() === studentId.toString()
  );
  
  return studentAttempts.length < this.settings.maxAttempts;
};

// Instance method to grade exam attempt
examSchema.methods.gradeAttempt = function(attemptId) {
  const attempt = this.attempts.id(attemptId);
  if (!attempt) return null;

  let totalPoints = 0;
  let earnedPoints = 0;

  attempt.answers.forEach(answer => {
    const question = this.questions.id(answer.question);
    if (!question) return;

    totalPoints += question.points;

    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      const isCorrect = answer.selectedOptions.every(optionIndex => {
        return question.options[optionIndex] && question.options[optionIndex].isCorrect;
      });

      answer.isCorrect = isCorrect;
      answer.pointsEarned = isCorrect ? question.points : 0;
      earnedPoints += answer.pointsEarned;
    }
    // Essay questions need manual grading
  });

  attempt.score = (earnedPoints / totalPoints) * 100;
  attempt.passed = attempt.score >= this.passingScore;
  attempt.endTime = new Date();

  return attempt;
};

// Static method to get exam statistics
examSchema.statics.getExamStats = async function(examId) {
  const exam = await this.findById(examId);
  if (!exam) return null;

  const totalAttempts = exam.attempts.length;
  const passedAttempts = exam.attempts.filter(a => a.passed).length;
  const averageScore = exam.attempts.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts;

  return {
    totalAttempts,
    passedAttempts,
    passRate: (passedAttempts / totalAttempts) * 100,
    averageScore,
  };
};

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam; 