require('dotenv').config()

const mong= require('mongoose');

mong.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/postdb');

const userSchema=mong.Schema({
    name: String,
    email:{
        type: String,
    },
    password: String,
    post: [{
        type: mong.Schema.Types.ObjectId,
        ref: 'post'
    }]
})

module.exports=mong.model('user',  userSchema);