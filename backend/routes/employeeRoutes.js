const express = require('express')
const Employee = require('../models/Employee')

const router = express.Router()

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find()
    res.json(employees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Add an employee
router.post('/', async (req, res) => {
  try {
    const employee = new Employee(req.body)
    const savedEmployee = await employee.save()
    res.status(201).json(savedEmployee)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete an employee
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id)
    res.json({ message: 'Employee deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router