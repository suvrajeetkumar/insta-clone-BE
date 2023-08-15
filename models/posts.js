const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const Schema = mongoose.Schema;


const postSchema = new Schema({
    title:{
        type:String,
        required:[true,'title field is required']
    },
    body:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"no photo"
    },
    likes:[{
    type:ObjectId,
    ref:"accounts"}],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"accounts"}
    }],
    postedBy:{
        type:ObjectId,
        ref:"accounts"
    }
    

},{timestamps:true});

const posts = mongoose.model('Post',postSchema);

module.exports = posts;