const express = require('express')
const http = require('http')
const cors = require('cors')
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
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Make io accessible to route handlers
app.use((req, res, next) => {
  req.io = io
  next()
})

// Routes
app.use('/api/chats', chatRoutes)

// Connect to MongoDB
connectDB()

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 