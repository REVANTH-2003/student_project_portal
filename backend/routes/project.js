const express = require('express');
const router = express.Router();
const { getProjects } = require('../controllers/projectController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate')

const path = require('path')

router.route('/projects').get(isAuthenticatedUser, getProjects);

module.exports = router;