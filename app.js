const express = require('express');
const mongoose = require('mongoose')
const app = express();
const multer = require('multer');


const adminroutes=require('./routes/adminroutes')
const userroutes = require('./routes/userroutes')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images');
    },
    filename: (req, file, cb) => {
      cb(null,  file.originalname);
      // cb(null, new Date().toISOString().replace(/:/g, "-") + '-' + file.originalname);
      // replace(/:/g,"-") will replace : to - , g means replace all :
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

app.use(express.json());
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
  );
app.use(express.static('images'));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use('/admin',adminroutes);
app.use(userroutes);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  });


mongoose
.connect()
.then(
    app.listen(3000)
)
.catch(err=>console.log(err))