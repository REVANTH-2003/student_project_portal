const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please enter name']
    },
    email:{
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        maxlength: [6, 'Password cannot exceed 6 characters'],
        select: false
    },
    collegeName : {
        type: String,
        required: [true, 'Please enter college name']
    },
    major : {
        type: String,
        required: [true, 'Please enter your major']
    },
    projects: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Project', // Reference to the Project model
        },
      ],
      
    contact : String,
    dob: Date,
    gender : String,
    
    profile: {
        type: String
    },

    role :{
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt :{
        type: Date,
        default: Date.now
    }
})


let model =  mongoose.model('User', userSchema);
module.exports = model;