const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'document', 'link'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    name: String,
    size: Number
  }],
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['private', 'group'],
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  groupName: {
    type: String,
    trim: true,
    required: function() {
      return this.type === 'group';
    }
  },
  groupAvatar: {
    type: String,
    default: 'default-group.png'
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [messageSchema],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  metadata: {
    totalMessages: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Update metadata when new message is added
chatSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.metadata.totalMessages = this.messages.length;
    this.metadata.lastActivity = Date.now();
  }
  next();
});

// Instance method to add message
chatSchema.methods.addMessage = async function(messageData) {
  this.messages.push(messageData);
  this.lastMessage = messageData._id;
  return this.save();
};

// Instance method to mark messages as read
chatSchema.methods.markAsRead = async function(userId) {
  this.messages.forEach(message => {
    if (!message.readBy.some(read => read.user.toString() === userId.toString())) {
      message.readBy.push({ user: userId });
    }
  });
  return this.save();
};

// Static method to get user's chats
chatSchema.statics.getUserChats = async function(userId) {
  return this.find({
    participants: userId,
    isActive: true
  })
    .populate('participants', 'firstName lastName avatar')
    .populate('lastMessage')
    .sort({ 'metadata.lastActivity': -1 });
};

// Static method to get chat statistics
chatSchema.statics.getChatStats = async function(chatId) {
  const chat = await this.findById(chatId);
  if (!chat) return null;

  return {
    totalMessages: chat.metadata.totalMessages,
    participantsCount: chat.participants.length,
    activeTime: Date.now() - chat.createdAt,
    messagesPerDay: chat.metadata.totalMessages / ((Date.now() - chat.createdAt) / (1000 * 60 * 60 * 24))
  };
};

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat; 