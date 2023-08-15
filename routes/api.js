const express = require('express');
const router = express.Router();
const User = require('../models/accounts');
const Post = require('../models/posts')
const Tweet = require('../models/tweets');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const requireLogin = require('../middleware/requireLogin');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.get('/protected',requireLogin,function(req,res){
    // res.send("access granted")
    console.log("api requests works")
})
router.get('/',function(req,res){
    res.send("hello world") 
})

router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"user not found"})
    })
})

router.post('/signup',function(req,res){
    const{name,email,password,pic,phoneNumber} = req.body;
    if(!email||!password||!name){
        return res.status(422).json({error:"please add all the feilds"})     //to also change the status code to 422 which means request was formed but unable to follow due to semantic errors
    }
    
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({message:"user already exists with this email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password: hashedpassword,
                name,
                pic,
                phoneNumber
            })
    
            user.save()
            .then(user=>{
                res.json({message:"saved message"})
            })
            .catch(err=>{
                console.log(err)
            })
        })

    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin' , function(req,res){
    const {email,password} = req.body;
    
    if(!email||!password){
        return res.status(422).json({error:"type all the fields"})
    } 
    
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:"invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then((doMatch)=>{
            if(doMatch){
                // res.json({message:"successfully logged in"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,followers,following,pic} = savedUser
                res.json({token:token,user:{_id,name,followers,following,pic}}); 
            }
            else{
                return res.status(422).json({error:"invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })


})

router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})
router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.unfollowId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})

router.put('/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{pic:req.body.pic}
    },{new:true}).select("-password").then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
})

router.post('/search',(req,res)=>{
    const query = req.body.query;

    const userSearch = User.find({ email: { $regex: "^" + query, $options: "i" } }).select("email _id");
    const tweetSearch = Tweet.find({ tweet: { $regex: query, $options: "i" } })
      .populate('postedBy', '_id name')
      .select('tweet postedBy');
  
    Promise.all([userSearch, tweetSearch])
      .then(([users, tweets]) => {
        res.json({ users, tweets });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'An error occurred' });
      });
})


module.exports = router;