const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const accessTokenSchema= new Schema({
    accessToken:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    }
});

module.exports = mongoose.model('accessToken', accessTokenSchema);