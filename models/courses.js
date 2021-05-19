const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const coursesSchema=new Schema({

    categoryname:{
        type: 'string',
        required:true
    },
    imageUrl:{
        type: 'string',
        required:true
    },
    courses:[
        {
            _id : mongoose.Schema.Types.ObjectId,
            coursename:{
                type:'string',
                required:true
            },
            
            prerequirements:{
                type:'string',
                required:true
            },
            description:{
                type:'string',
                required:true
            },
            duration:{
                type:'string',
                required:true
            }
        }
    ]
},
{ timestamps: true }
)

module.exports = mongoose.model('Courses', coursesSchema);
