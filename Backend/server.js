const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const dotenv = require('dotenv')
const connectDB = require('./config/database')
const setupSocket = require('./config/socket')
const chatRoutes = require('./routes/chatRoutes')

dotenv.config()

const app = express()
const server = http.createServer(app)

// Set up Socket.IO
const io = setupSocket(server)

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Make io accessible to route handlers
app.use((req, res, next) => {
  req.io = io
  next()
})

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/courses', require('./routes/courseRoutes'))
app.use('/api/chat', chatRoutes)

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../Frontend/dist')))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something broke!' })
})

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
}) 