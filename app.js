//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
mongoose.connect('mongodb://127.0.0.1:27017/userDB',{useNewUrlParser:true});

const userSchema = new mongoose.Schema({//use mongoose schema to add encryption
    email:String,
    password:String
});

console.log(process.env.API_KEY);

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});// always comes before mongoose model

const User =mongoose.model("User",userSchema);

const app= express();
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res)
{
    res.render("home");
});

app.get("/login", function(req,res)
{
    res.render("login");
});

app.get("/register", function(req,res)
{
    res.render("register");
});

app.post("/register", function(req,res)
{
    const newUser= new User (
        {
            email: req.body.username,
            password :req.body.password
        }
    );
    newUser.save(function(err)
    {
        if(!err)
        {
            res.render("secrets");
        }
        else{
            console.log(err);
        }
    });
});

app.post("/login",function(req,res)
{
    const username= req.body.username;
    const password=req.body.password;
    User.findOne({email:username},function(err,foundUser)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            if(foundUser)
            {
                if(password === foundUser.password)
                {
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000,function()
{
    console.log("server listening at port 3000");
});