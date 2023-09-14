const express = require('express');
const router = express.Router();
const { getProjects } = require('../controllers/projectController');
const path = require('path')

router.route('/projects').get(getProjects);

module.exports = router;