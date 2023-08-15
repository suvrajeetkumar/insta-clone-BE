const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const mongoose = require('mongoose');   
const User = require('../models/accounts');
module.exports = (req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({error:"you must first be logged in"})
    }
    //otherwise if no error then get the token  
    const token = authorization.replace("Bearer ","")

    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must first be logged in"})
        }
        const {_id} = payload       
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()            
        })
        
    })
}

