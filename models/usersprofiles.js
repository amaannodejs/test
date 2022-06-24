const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userprofileSchema= new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    mobile_no:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('userprofile', userprofileSchema);