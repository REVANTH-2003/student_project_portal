const Project = require('../models/projectModel');

exports.getProjects = (req,res,next)=>
{
    res.status(200).json({
        success : true,
        message :"Project Configured Successfully !"
    })
}