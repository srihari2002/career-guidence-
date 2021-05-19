const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const examsSchema=new Schema({

    categoryname:{
        type: 'string',
        required:true
    },
    imageUrl:{
        type: 'string',
        required:true
    },
    exams:[
        {
            _id : mongoose.Schema.Types.ObjectId,
            examname:{
                type:'string',
                required:true
            },
            
            purpose:{
                type:'string',
                required:true
            },
            eligibility:{
                type:'string',
                required:true
            },
            applicationmode:{
                type:'string',
                required:true
            }
        }
    ]
},
{ timestamps: true }
)

module.exports = mongoose.model('Exams', examsSchema);
