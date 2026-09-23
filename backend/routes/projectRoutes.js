const express = require('express')
const Project = require('../models/Project')

const router = express.Router()

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Add project
router.post('/', async (req, res) => {
  try {
    console.log('PROJECT DATA RECEIVED:', req.body)

    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      assignedEmployees: req.body.assignedEmployees || []
    })

    const savedProject = await project.save()

    console.log('PROJECT SAVED:', savedProject)

    res.status(201).json(savedProject)
  } catch (error) {
    console.log('PROJECT ERROR:', error.message)
    res.status(400).json({ message: error.message })
  }
})

// Edit project
router.put('/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )

    res.json(updatedProject)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Project deleted successfully'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router