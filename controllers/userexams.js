const Exams = require('../models/exams');

exports.getcategories = (req, res, next) => {
    Exams.find().then((categories) => {
      const categorynames = categories.map((i) => {
        return { categoryname: i.categoryname, imageUrl: i.imageUrl, id: i._id };
      });
  
      res.status(200).json({
        message: "Categories fetched successfully.",
        examcategories: categorynames,
      });
    });
};

exports.getcategory = (req, res, next) => {
    const id = req.params.categoryid;
    Exams.findById(id).then((exams) => {
      res.status(200).json({exams:exams.exams});
    });
};