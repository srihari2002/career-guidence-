const express = require('express');
const router = express.Router();

const coursescontroller =require('../controllers/admincourses')
const examcontroller = require('../controllers/adminexams')

// Courses
router.get('/coursecategories',coursescontroller.getcategories);
router.get('/coursecategories/:categoryid',coursescontroller.getcategory)
router.get('/geteditcourse/:categoryid/:courseid',coursescontroller.geteditcourse)

router.post('/addcoursecategory',coursescontroller.addcategory)
router.post('/addcourses/:categoryid',coursescontroller.addcourses)


router.put('/editcoursecategory/:categoryid',coursescontroller.editcategory)
router.put('/editcourse/:categoryid/:courseid',coursescontroller.editcourse)


router.delete('/deletecoursecategory/:categoryid',coursescontroller.deletecategory)
router.delete('/deletecourse/:categoryid/:courseid',coursescontroller.deletecourse)


//exams
router.get('/examcategories',examcontroller.getcategories);
router.get('/examcategories/:categoryid',examcontroller.getcategory)
router.get('/geteditexam/:categoryid/:examid',examcontroller.geteditexam)


router.post('/addexamcategory',examcontroller.addcategory)
router.post('/addexams/:categoryid',examcontroller.addexams)


router.put('/editexamcategory/:categoryid',examcontroller.editcategory)
router.put('/editexam/:categoryid/:examid',examcontroller.editexam)


router.delete('/deleteexamcategory/:categoryid',examcontroller.deletecategory)
router.delete('/deleteexam/:categoryid/:examid',examcontroller.deleteexam)


module.exports=router;