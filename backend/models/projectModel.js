const mongoose = require('mongoose');

// Define the Project schema
const projectSchema = new mongoose.Schema({
  
    title: {
    type: String,
    required: [true, 'Please enter your project title']
  },

  description: {
    type: String,
    required: [true, 'Please enter your project description']
  },

  category: {
    type: String,
    required: [true, 'Please enter your category of your project']
  },

  technologyUsed: {
    type: [String],
    required: [true, 'Please select the technology used'],
    validate: {
      validator: (array) => array.length > 0,
      message: 'At least one technology must be used.',
    },
  },

  projectFiles: {
    type: String,
    required: [true, 'Please enter your major']
  },

  comments: [
    {
      name: String,
      time: Date,
      comment: String,
    },
  ],

  likes: {
    type: Number,
    default: 0,
  },

  projectDocumentation: String,
  projectURL: String,
  projectImage: String,
  
});

// Create the Project model
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
