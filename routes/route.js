const express = require('express');
const route = express.Router();

const nav_send={"name":"Malay","tag":"5 star"}

route.get('/',(req,res,next) =>{
    const nav_send_home=nav_send;
    nav_send_home.page_title="Home";
    
    console.log("Route to home");
    res.render('home.ejs',nav_send);
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


module.exports = route;

