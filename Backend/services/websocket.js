const socketIO = require('socket.io')
const jwt = require('jsonwebtoken')

function initializeWebSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  })

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication error'))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.userId
      next()
    } catch (err) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId)

    // Join personal room
    socket.join(socket.userId)

    // Handle course chat
    socket.on('join-course', (courseId) => {
      socket.join(`course:${courseId}`)
    })

    socket.on('course-message', ({ courseId, message }) => {
      io.to(`course:${courseId}`).emit('new-message', {
        userId: socket.userId,
        message,
        timestamp: new Date()
      })
    })

    // Handle notifications
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId)
    })
  })

  return io
}

module.exports = initializeWebSocket 