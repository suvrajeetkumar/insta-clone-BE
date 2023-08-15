const express = require('express');
const {MONGOURI} = require('./keys');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
// qKXFQ07za0PoZUwj

//connect to mongodb
// mongoose.connect('mongodb://localhost:27017/instagram', {useNewUrlParser: true});

// donot uncomment the above 2 lines they were commented from start.

mongoose.connect(MONGOURI,{useNewUrlParser: true});
mongoose.connection.on('connected',()=>{
    console.log("yeah connected to mongodb atlas")
})

mongoose.connection.on('error',(err)=>{
    console.log("error connecting",err)
})

//set up express app
const app = express();


const routes = require('./routes/api');
const postroutes = require('./routes/post');
//bodyparser
app.use(bodyParser.json());






//routes
app.use(routes);
app.use(postroutes);


//listen to port number
app.listen(process.env.port || 4000,function(){
    console.log("listening to port 4000");
});
