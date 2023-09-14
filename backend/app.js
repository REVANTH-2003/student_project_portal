const express = require('express');
const app = express();
const path = require('path')
const dotenv = require('dotenv');
dotenv.config({path:path.join(__dirname,"config/config.env")});


// import the required routes
const projects = require('./routes/project')


// Configure a routes
app.use('/api/', projects);


module.exports = app;