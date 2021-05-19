 
const Category = require("../models/courses");

exports.getcategories = (req, res, next) => {
    Category.find().then((categories) => {
      const categorynames = categories.map((i) => {
        return { categoryname: i.categoryname, imageUrl: i.imageUrl, id: i._id };
      });
  
      res.status(200).json({
        coursecategories: categorynames,
      });
    });
};

exports.getcategory = (req, res, next) => {
    const id = req.params.categoryid;
    Category.findById(id).then((courses) => {
      res.status(200).json({courses:courses.courses});
    });
};