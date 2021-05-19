const express = require('express');
const router = express.Router();
const coursescontroller = require('../controllers/usercourses')
const examcontroller = require('../controllers/userexams')

// courses
router.get('/coursecategories',coursescontroller.getcategories);
router.get('/coursecategories/:categoryid',coursescontroller.getcategory)

//exams
router.get('/examcategories',examcontroller.getcategories);
router.get('/examcategories/:categoryid',examcontroller.getcategory)

module.exports=router;