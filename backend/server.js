const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const employeeRoutes = require('./routes/employeeRoutes')
const projectRoutes = require('./routes/projectRoutes')
const taskRoutes = require('./routes/taskRoutes')

const app = express()

// Allow requests from the React frontend
app.use(cors({
  origin: true,
  credentials: true
}))

app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.send('Project Management Backend is Running!')
})

// API routes
app.use('/api/employees', employeeRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)

const PORT = 5000

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.log('MongoDB connection failed:', error.message)
  })