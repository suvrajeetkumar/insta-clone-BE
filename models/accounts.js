const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types

const accountsSchema = new Schema({
    name:{
        type:String,
        required:[true,'Name field is required']
    },
    email:{
        type:String,
        required:[true,'Email field is required']
    },
    password:{
        type:String,
        required:[true,'Password field is required']
    },
    
    pic:{
        type:String,
        default:"https://res.cloudinary.com/suvra15/image/upload/v1623251633/noimage_nayp5f.png"
    },

    phoneNumber: {
        type:String,
        required:[true,'Phone Number field is required']
    },

    followers:[{
        type:ObjectId,
        ref:"accounts"}],
    
    following:[{
        type:ObjectId,
        ref:"accounts"}],

});

const accounts = mongoose.model('accounts',accountsSchema);

module.exports = accounts;