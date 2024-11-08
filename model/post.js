const mong= require('mongoose');


const post_schema=mong.Schema({
    content:String,
    path:String,
    author:{
        type:mong.Schema.Types.ObjectId,
        ref: "user"
    }
})

module.exports=mong.model("post", post_schema);