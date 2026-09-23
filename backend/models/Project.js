const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  status: {
    type: String,
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  assignedEmployees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    }
  ]
})

module.exports = mongoose.model('Project', projectSchema)