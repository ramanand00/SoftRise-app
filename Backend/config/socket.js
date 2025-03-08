const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user._id}`);

    // Join user to their chat rooms
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.user._id} joined chat: ${chatId}`);
    });

    // Leave chat room
    socket.on('leaveChat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.user._id} left chat: ${chatId}`);
    });

    // Handle typing status
    socket.on('typing', (data) => {
      socket.to(data.chatId).emit('userTyping', {
        chatId: data.chatId,
        userId: socket.user._id,
        userName: `${socket.user.firstName} ${socket.user.lastName}`
      });
    });

    // Handle stop typing
    socket.on('stopTyping', (data) => {
      socket.to(data.chatId).emit('userStoppedTyping', {
        chatId: data.chatId,
        userId: socket.user._id
      });
    });

    // Handle user presence
    socket.on('setPresence', (status) => {
      io.emit('userPresenceUpdate', {
        userId: socket.user._id,
        status: status
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user._id}`);
      io.emit('userPresenceUpdate', {
        userId: socket.user._id,
        status: 'offline'
      });
    });
  });

  return io;
};

module.exports = setupSocket; 