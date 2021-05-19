const mongoose = require("mongoose");
const Category = require("../models/courses");
const fs = require("fs");
const path = require("path");

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

exports.addcategory = (req, res, next) => {
  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const categoryname = req.body.categoryname;

  const category = new Category({
    categoryname: categoryname,
    imageUrl: imageUrl,
    courses: [],
  });
  category
    .save()
    .then((result) => {
      const {_id,categoryname,imageUrl}=result;
      res.status(200).json({ message: "category Added", coursecategory:{_id,categoryname,imageUrl} })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.editcategory = (req, res, next) => {
  const id = req.params.categoryid;
  const upcategoryname = req.body.categoryname;
  let upimageUrl = req.body.image;

  if (req.file) {
    upimageUrl = req.file.path;
  }
  if (!upimageUrl) {
    const error = new Error("No file picked.");
    error.statusCode = 422;
    throw error;
  }

  Category.findOne({ _id: id })
    .then((category) => {
      if (!category) {
        const error = new Error("Could not find category");
        error.statusCode = 404;
        throw error;
      }
      if (upimageUrl !== category.imageUrl) {
        clearImage(category.imageUrl);
      }
      category.categoryname = upcategoryname;
      category.imageUrl = upimageUrl;
      return category.save();
    })
    .then((result) => {
      const {_id,categoryname,imageUrl}=result;
      res.status(200).json({ message: "category updated", coursecategory:{_id,categoryname,imageUrl} });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletecategory = (req, res, next) => {
  const id = req.params.categoryid;
  Category.findOne({ _id: id })
    .then((result) => {
      if (result) {
        const imageUrl = result.imageUrl;
        result.delete().then(() => {
          clearImage(imageUrl);
          return res.status(200).json({ message: "Category deleted" });
        });
      } else {
        return res
          .status(500)
          .json({ message: "Cant able to find the category mentioned" });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.getcategory = (req, res, next) => {
  const id = req.params.categoryid;
  Category.findById(id).then((courses) => {
    res.status(200).json({courses:courses.courses});
  });
};

exports.addcourses = (req, res, next) => {
  Category.findById(req.params.categoryid)
    .then((category) => {
      if (category) {
        category.courses.push({
          _id: new mongoose.Types.ObjectId(),
          coursename: req.body.coursename,
          prerequirements: req.body.prerequirements,
          description: req.body.description,
          duration: req.body.duration,
        });
        category.save().then((category) => {
          return res.status(201).json({message:"Course added successfully", courses: category.courses });
        });
      } else {
        return res
          .status(500)
          .json({ result: "cant able to find the category mentioned" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.geteditcourse=(req, res, next)=> {
  const categoryid = req.params.categoryid;
  const courseid = req.params.courseid;
  Category.findOne({ _id: categoryid})
  .then((result)=>{
    let index=0;
    let arrayindex=0;
   const course =result.courses.map((i)=>{
     if(i._id==courseid){
      arrayindex =index;  
      return{_id:i._id,coursename:i.coursename,prerequirements:i.prerequirements,duration:i.duration,description:i.description}
     }
     else{
       index+=1
     }
   })
    return res.status(200).json({ coursedetails: course[arrayindex ]  });

  })
}

exports.editcourse = (req, res, next) => {
  const categoryid = req.params.categoryid;
  const courseid = req.params.courseid;
  const { coursename, prerequirements, duration, description } = req.body;

  Category.updateOne(
    { _id: categoryid, "courses._id": courseid },
    {
      $set: {
        "courses.$.coursename": coursename,
        "courses.$.prerequirements": prerequirements,
        "courses.$.description": description,
        "courses.$.duration": duration,
      },
    }
  )
  .then((result) => {
    if(result.nModified!=0){
      console.log(result);
      return res.status(200).json({ result: "Course edited successfully" });

    }
    else{
      return res.status(500).json({ result: "Cant able to update the course" });

    }
  });
};

 
exports.deletecourse = (req, res, next) => {
  const categoryid = req.params.categoryid;
  const courseid = req.params.courseid;
  Category.findOne({ _id: categoryid }).then((result) => {
    if (!result) {
      return res.status(500).json({ result: "category not found" });
    }
    result.courses.pull({ _id: courseid });
    result.save().then(() => {
      return res.status(200).json({ result: "Course deleted successfully" });
    });
  });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
