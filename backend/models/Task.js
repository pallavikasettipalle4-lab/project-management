const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  status: {
    type: String,
    required: true
  },

  priority: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },

  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  }
})

module.exports = mongoose.model('Task', taskSchema)