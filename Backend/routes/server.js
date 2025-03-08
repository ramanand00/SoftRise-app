const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const morgan = require('morgan')

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your React app URL
  credentials: true
}))
app.use(express.json())
app.use(morgan('dev')) // Logging middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Routes
app.use('/api/auth', require('./auth'))
app.use('/api/profile', require('../server/routes/profile'))
app.use('/api/courses', require('./routes/courses'))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 