const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    tweet:{
        type:String,
        required:[true,'title field is required']
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

const tweet = mongoose.model('Tweet',tweetSchema);

module.exports = tweet;