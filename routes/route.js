const express = require('express');
const app = express()
const { isLoggedIn } = require('../middleware');
const route = express.Router();
const mongoose = require("mongoose")
const mymodel = require("../models/blog")
const usermodel = require("../models/user")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))



const nav_send = { "name": "Malay", "tag": "5 star" };

route.get('/',isLoggedIn, (req,res,next) =>{
    const nav_send_home=nav_send;
    nav_send_home.page_title="Home";
    
    console.log("Route to home");
    res.render('home.ejs',nav_send);
})
route.get('/temp', (req,res,next) =>{
    const nav_send_home=nav_send;
    nav_send_home.page_title="Home";
    
    console.log("Route to home");
    res.render('temp_home.ejs',nav_send);
})
route.get('/profile',(req,res,next) =>{
    const nav_send_profile=nav_send;
    nav_send_profile.page_title="Profile";
    console.log("Route to home")

    res.render('profile.ejs',nav_send);
})
route.get('/none',(req,res,next) =>{
    console.log("Route to none")
    const nav_send_home=nav_send;
    nav_send_home.page_title="None";
    res.render('none.ejs',nav_send);
})
route.get('/BlogDisplay',(req,res,next) =>{
    console.log("Route to none")
    const nav_send_home=nav_send;
    nav_send_home.page_title="BlogDisplay";
    res.render('BlogDisplay.ejs',nav_send);
})
route.get('/messages',(req,res,next) =>{
    console.log("Route to none")
    res.render('messages.ejs',nav_send);
})
route.get('/notifications',(req,res,next) =>{
    console.log("Route to none")
    res.render('notifications.ejs',nav_send);
})
route.get('/settings',(req,res,next) =>{
    console.log("Route to none")
    res.render('settings.ejs',nav_send);
})
route.get('/bookmarks',(req,res,next) =>{
    console.log("Route to none")
    res.render('bookmarks.ejs',nav_send);
})
route.get('/your-pokis',(req,res,next) =>{
    console.log("Route to none")
    res.render('your-pokis.ejs',nav_send);
})
route.get('/trending',(req,res,next) =>{
    console.log("Route to none")
    res.render('trending.ejs',nav_send);
})
route.get('/your-projects',(req,res,next) =>{
    console.log("Route to none")
    res.render('trending.ejs',nav_send);
})

route.get('/demo-blog',async (req,res,next)=>{
    let doc = await mymodel.findById("611623d34d5e6f239ce82de2")
    const nav_send_home=nav_send;
    nav_send_home.page_title="DEMOBlogDisplay";
    // let uid = await usermodel.find({email:req.params.name}) 
    let user = await usermodel.findById({_id:"6109179f640e3939902b5f3d"})
    res.render("demoblog",{blog:doc,user:user,name:"shreya",tag:"jnln",page_title:"demo"})
})
route.get('/your-pokis-created',(req,res,next) =>{
    console.log("Route to none")
    res.render('your-pokis-created.ejs',nav_send);
})
route.get('/create-blog',(req,res,next) =>{
    console.log("Route to none")
    res.render('create-blog.ejs',nav_send);
})

// route.get('*',(req,res)=>{
//     console.log("Route to none")
//     const nav_send_home=nav_send;
//     nav_send_home.page_title="None";
//     res.render('none.ejs',nav_send);
// })

module.exports = route;

