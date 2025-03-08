const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
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
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  grade: {
    type: String,
    enum: ['Pass', 'Merit', 'Distinction'],
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  completionDate: {
    type: Date,
    required: true,
  },
  certificateUrl: {
    type: String,
    required: true,
  },
  verificationUrl: {
    type: String,
    required: true,
  },
  metadata: {
    courseTitle: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    courseDuration: {
      type: Number, // in hours
      required: true,
    },
    courseLevel: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Generate certificate number
certificateSchema.pre('save', function(next) {
  if (this.isNew) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.certificateNumber = `CERT-${timestamp}-${random}`;
  }
  next();
});

// Set expiry date (if applicable)
certificateSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set expiry date to 2 years from issue date (optional)
    this.expiryDate = new Date(this.issueDate.getTime() + (2 * 365 * 24 * 60 * 60 * 1000));
  }
  next();
});

// Generate verification URL
certificateSchema.pre('save', function(next) {
  if (this.isNew) {
    this.verificationUrl = `${process.env.BASE_URL}/verify-certificate/${this.certificateNumber}`;
  }
  next();
});

// Instance method to check if certificate is valid
certificateSchema.methods.isValid = function() {
  if (this.status !== 'active') return false;
  if (this.expiryDate && new Date() > this.expiryDate) return false;
  return true;
};

// Instance method to revoke certificate
certificateSchema.methods.revoke = function() {
  this.status = 'revoked';
  return this.save();
};

// Static method to verify certificate by number
certificateSchema.statics.verifyCertificate = async function(certificateNumber) {
  const certificate = await this.findOne({ certificateNumber })
    .populate('user', 'firstName lastName email')
    .populate('course', 'title category level');
  
  if (!certificate) return null;
  
  return {
    isValid: certificate.isValid(),
    certificate: certificate,
  };
};

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate; 