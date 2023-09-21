const Project = require('../models/projectModel');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');
const mongoose = require('mongoose');


// welcome page - /
exports.welcome = catchAsyncError(async (req, res, next) => {
    res.status(200).render('welcome'); }
);

exports.home = catchAsyncError(async (req, res, next) => {
    res.status(200).render('home', ); }
);

//Get Projects - /projects
exports.getProjects = catchAsyncError(async (req, res, next)=>{
    const resPerPage = 4;
    
    let buildQuery = () => {
        return new APIFeatures(Project.find(), req.query).search().filter()
    }

    const projects = await buildQuery().paginate(resPerPage).query;

    res.status(200).json({
        success : true,
        projects
    })
})

//Create Project - /project/new
exports.newProject = catchAsyncError(async (req, res, next)=>{

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    
    if('projectImage' in req.files){
    let url = `${BASE_URL}/uploads/projects/image/${req.files['projectImage'][0].filename}`;
    req.body.projectImage = url;
    }
    else
    {
        let url = `${BASE_URL}/uploads/projects/image/default.jpg`;
        req.body.projectImage = url;  
    }

    if('projectDocumentation' in req.files)
    {
        let url = `${BASE_URL}/uploads/projects/documentation/${req.files['projectDocumentation'][0].filename}`;
        req.body.projectDocumentation = url;
    }

    if('projectFiles' in req.files)
    {
        let url = `${BASE_URL}/uploads/projects/file/${req.files['projectFiles'][0].filename}`;
        req.body.projectFiles = url;
    }

    req.body.user = req.user.id;
    req.body.collegeName = req.user.collegeName;
    const project = await Project.create(req.body);
    
    let projects = req.user.projects;
    projects.push(project.id);

    const user = await User.findByIdAndUpdate(req.user.id, {projects:projects} , {
        new: true,
        runValidators: true,
    })

    res.status(201).json({
        success: true,
        project
    })
});

//Get Single Project - /project/:id
exports.getSingleProject = catchAsyncError(async(req, res, next) => {
    const project = await Project.findById(req.params.id).populate('comments.user','name email');

    if(!project) {
        return next(new ErrorHandler('Project not found', 400));
    }

    res.status(201).json({
        success: true,
        project
    })
})

//Update Project - /project/:id
exports.updateProject = catchAsyncError(async (req, res, next) => {
    let project = await Project.findById(req.params.id);

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if('projectImage' in req.files)
    {
        let url = `${BASE_URL}/uploads/projects/image/${req.files['projectImage'][0].filename}`;
        req.body.projectImage = url;
    }
    else
    {
        let url = `${BASE_URL}/uploads/projects/image/default.jpg`;
        req.body.projectImage = url;  
    }
    
    if('projectDocumentation' in req.files)
    {
        let url = `${BASE_URL}/uploads/projects/documentation/${req.files['projectDocumentation'][0].filename}`;
        req.body.projectDocumentation = url;
    }
    
    if('projectFiles' in req.files)
    {
        let url = `${BASE_URL}/uploads/projects/file/${req.files['projectFiles'][0].filename}`;
        req.body.projectFiles = url;
    }
    
    if(!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found"
        });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        project
    })

})

//Delete Project - /project/:id
exports.deleteProject = catchAsyncError(async (req, res, next) =>{
    const project = await Project.findById(req.params.id);

    if(!project ) {
        return res.status(404).json({
            success: false,
            message: "Project not found"
        });
    }

    await Project.deleteOne({ _id: req.params.id });

    const id = new mongoose.Types.ObjectId(req.params.id);

   let array = req.user.projects.filter(item => item.toString() !== id.toString());


    console.log(array)

    await User.findByIdAndUpdate(req.user.id , { projects:array });
      
    res.status(200).json({
        success: true,
        message: "Project Deleted!"
    })

})


//Create Comment - project/newcomment/:id
exports.createComment = catchAsyncError(async (req, res, next) =>{
    const  { comment } = req.body;

    const data = {
        user : req.user.id,
        comment
    }

    const project = await Project.findById(req.params.id);
   
    //creating the comment
    project.comments.push(data);

    await project.save({validateBeforeSave: false});

    res.status(200).json({
        success: true
    })


})

//update comment - project/comment/:id ?commentId={commentid}
exports.updateComment = catchAsyncError(async (req, res, next) =>{
    const project = await Project.findById(req.params.id);
    
    let comments = project.comments;
    comments.forEach(comment =>{
        if(comment._id.toString() === req.query.commentId.toString())
        {
            comment.comment = req.body.comment;
        }
    })

    //save the document
    await Project.findByIdAndUpdate(req.params.id, {
        comments
    })
    res.status(200).json({
        success: true
    })

});


//Delete comment - project/comment/:id ?commentId={commentid}

exports.deleteComment = catchAsyncError(async (req, res, next) =>{
    const project = await Project.findById(req.params.id);
    
    //filtering the comments which does match the deleting comment id
    const comments = project.comments.filter(comment => {
       return comment._id.toString() !== req.query.commentId.toString()
    });

    //save the document
    await Project.findByIdAndUpdate(req.params.id, {
        comments
    })
    res.status(200).json({
        success: true
    })

});