const mongoose = require("mongoose");
const Exams = require('../models/exams');
const fs = require("fs");
const path = require("path");

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

exports.addcategory = (req, res, next) => {
    if (!req.file) {
      const error = new Error("No image provided.");
      error.statusCode = 422;
      throw error;
    }
    const imageUrl = req.file.path;
    const categoryname = req.body.categoryname;
  
    const category = new Exams({
      categoryname: categoryname,
      imageUrl: imageUrl,
      exams: [],
    });
    category
      .save()
      .then((result) => {
        const {_id,categoryname,imageUrl}=result;
        res.status(200).json({ message: "category Added", examcategory:{_id,categoryname,imageUrl} })
  
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
  
    Exams.findOne({ _id: id })
      .then((post) => {
        if (!post) {
          const error = new Error("Could not find category");
          error.statusCode = 404;
          throw error;
        }
        if (upimageUrl !== post.imageUrl) {
          clearImage(post.imageUrl);
        }
        post.categoryname = upcategoryname;
        post.imageUrl = upimageUrl;
        return post.save();
      })
      .then((result) => {
        const {_id,categoryname,imageUrl}=result;
        res.status(200).json({ message: "category updated", examcategory:{_id,categoryname,imageUrl} });      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};

exports.deletecategory = (req, res, next) => {
    const id = req.params.categoryid;
    Exams.findOne({ _id: id })
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
    Exams.findById(id).then((exams) => {
      res.status(200).json({exams:exams.exams});
    });
};

exports.addexams = (req, res, next) => {
    Exams.findById(req.params.categoryid)
      .then((category) => {
        if (category) {
          category.exams.push({
            _id: new mongoose.Types.ObjectId(),
            examname: req.body.examname,
            purpose: req.body.purpose,
            eligibility: req.body.eligibility,
            applicationmode: req.body.applicationmode,
          });
          category.save().then((category) => {
            return res.status(201).json({ result: category.exams });
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

exports.geteditexam=(req, res, next)=> {
  const categoryid = req.params.categoryid;
  const examid = req.params.examid;
  Exams.findOne({ _id: categoryid})
  .then((result)=>{
    let index=0;
    let arrayindex=0;
   const exams =result.exams.map((i)=>{
     if(i._id==examid){  
      arrayindex =index;    
       return{_id:i._id,examname:i.examname,purpose:i.purpose,eligibility:i.eligibility,applicationmode:i.applicationmode}
     }
     else{
      index+=1
    }
   })
    return res.status(200).json({ examdetails: exams[arrayindex] });

  })
}

exports.editexam = (req, res, next) => {
    const categoryid = req.params.categoryid;
    const examid = req.params.examid;
    const { examname, purpose, eligibility, applicationmode } = req.body;
  
    Exams.updateOne(
      { _id: categoryid, "exams._id": examid },
      {
        $set: {
          "exams.$.examname": examname,
          "exams.$.purpose": purpose,
          "exams.$.eligibility": eligibility,
          "exams.$.applicationmode": applicationmode,
        },
      }
    )
    .then((result) => {
      if(result.nModified!=0){
        console.log(result);
        return res.status(200).json({ result: "Exam edited successfully" });
  
      }
      else{
        return res.status(500).json({ result: "Cant able to update the exam" });
  
      }
    });
};
  
exports.deleteexam = (req, res, next) => {
    const categoryid = req.params.categoryid;
    const examid = req.params.examid;
    Exams.findOne({ _id: categoryid }).then((result) => {
      if (!result) {
        return res.status(500).json({ result: "category not found" });
      }
      result.exams.pull({ _id: examid });
      result.save().then(() => {
        return res.status(200).json({ result: "Exam deleted successfully" });
      });
    });
};

const clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
  };
  