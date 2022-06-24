const userAddress = require('./userAddress');

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:Schema.Types.ObjectId,
        ref:"userAddress",
        required:true
    }
});

module.exports = mongoose.model('user', userSchema);