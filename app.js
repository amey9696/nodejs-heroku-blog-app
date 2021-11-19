const dotenv=require("dotenv");
const mongoose=require('mongoose');
const express =require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

dotenv.config({path:'./config.env'});

require('./db/conn'); 

app.use(express.json());

app.use(require('./router/auth')); 


const PORT=process.env.PORT

app.get('/contact',(req,res)=>{
    res.send("Contact here");
});

app.get('/login',(req,res)=>{ 
    res.send("Login here");
});

app.get('/register',(req,res)=>{
    res.send("Register here");
});

app.listen(PORT,()=>{
    console.log(`server is runnign at port no ${PORT}`);
})

