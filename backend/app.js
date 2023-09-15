const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser')
const path = require('path')
const dotenv = require('dotenv');
dotenv.config({path:path.join(__dirname,"config/config.env")});


app.use(express.json());
app.use(cookieParser());


// import the required routes
const projects = require('./routes/project')
const auth = require('./routes/auth')


// Configure a routes
app.use('/api/', projects);
app.use('/api/auth/',auth);



app.use(errorMiddleware)
module.exports = app;