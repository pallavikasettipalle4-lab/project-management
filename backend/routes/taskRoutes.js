const express = require('express')
const Task = require('../models/Task')

const router = express.Router()

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('projectId', 'name')
      .populate('employeeId', 'name email')

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Add task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body)

    const savedTask = await task.save()

    const populatedTask = await Task.findById(savedTask._id)
      .populate('projectId', 'name')
      .populate('employeeId', 'name email')

    res.status(201).json(populatedTask)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update task status
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
      .populate('projectId', 'name')
      .populate('employeeId', 'name email')

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Task deleted successfully'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router