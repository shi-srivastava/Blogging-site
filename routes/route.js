const express = require('express');
const app = express()
const { isLoggedIn } = require('../middleware');
const route = express.Router();
const mongoose = require("mongoose")
const mymodel = require("../models/blog")
const usermodel = require("../models/user")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))
const {cur_user} = require("./username")


const findUser = async(cur_user)=> { 
    try{
    if(cur_user !=""){
    return await usermodel.findOne({email:cur_user})
    }
    // return {username:"nothing"}
}
catch(error){
    console.log(error)
}
}
const nav_send ={"name":"s","tag":"h"}
route.get('/',isLoggedIn, (req,res,next) =>{
// console.log(`INSIDE FUNCTION ${cur_user.cur_user}`)
console.log(cur_user)
// const user = findUser(cur_user.cur_user)
// console.log(`user is ${user} ${user.username}`)
// const nav_send2 = { "name": user.username, "tag": "5 star" };

    const nav_send_home=nav_send;
    nav_send_home.page_title="Home";
    res.render('home.ejs',nav_send);
})
route.get('/temp', (req,res,next) =>{
    const nav_send_home=nav_send;
    nav_send_home.page_title="Home";
    
    console.log("Route to home");
    res.render('temp_home.ejs',nav_send);
})
route.get('/profile',async(req,res,next) =>{
    let doc = await mymodel.find({email:"b@b.com",is_draft:"n"})

    res.render('profile',{blog:doc,name:"shreya",tag:"jnln",page_title:"profile"});
})
route.get('/none',(req,res,next) =>{
    
    const nav_send_home=nav_send;
    nav_send_home.page_title="None";
    res.render('none.ejs',nav_send);
})
route.get('/BlogDisplay',(req,res,next) =>{
    
    const nav_send_home=nav_send;
    nav_send_home.page_title="BlogDisplay";
    res.render('BlogDisplay.ejs',nav_send);
})
route.get('/messages',(req,res,next) =>{
    
    res.render('messages.ejs',nav_send);
})
route.get('/notifications',(req,res,next) =>{
    
    res.render('notifications.ejs',nav_send);
})
route.get('/settings',(req,res,next) =>{
    
    res.render('settings.ejs',nav_send);
})
route.get('/bookmarks',(req,res,next) =>{
    
    res.render('bookmarks.ejs',nav_send);
})
route.get('/your-pokis',async(req,res,next) =>{
    console.log("YOUR POKIS")
    let doc = await mymodel.find({email:"b@b.com", is_draft:"y"})

    res.render('your-pokis.ejs',{blog:doc,name:"shreya",tag:"jnln",page_title:"pokis"});
})
route.get('/trending',(req,res,next) =>{
    
    res.render('trending.ejs',nav_send);
})
route.get('/your-projects',(req,res,next) =>{
    
    res.render('trending.ejs',{name:"shreya",tag:"jnln",page_title:"pokis"});
})

// route.get('/demo-blog',async (req,res,next)=>{
//     let doc = await mymodel.findById("611623d34d5e6f239ce82de2")
//     const nav_send_home=nav_send;
//     nav_send_home.page_title="DEMOBlogDisplay";
//     // let uid = await usermodel.find({email:req.params.name}) 
//     let user = await usermodel.findById({_id:"6109179f640e3939902b5f3d"})
//     res.render("demoblog",{blog:doc,user:user,name:"shreya",tag:"jnln",page_title:"demo"})
// })
route.get('/your-pokis-created',(req,res,next) =>{
    
    res.render('your-pokis-created',{name:"shreya",tag:"jnln",page_title:"pokis"});
})
route.get('/create-blog',(req,res,next) =>{
    res.render('create-blog.ejs',nav_send);
})
route.get("/draft_edit/:id",async(req,res)=>{
    let doc = await mymodel.findById(req.params.id)
    res.render("draft_edit",{blog:doc})
})
route.get("/demoblog/:id",async(req,res)=>{
    let doc = await mymodel.findById(req.params.id)
    res.render("demoblog",{blog:doc})
})
route.post("/draft-edit",async(req,res)=>{
    console.log(req.body.id)
    try{
   await mymodel.findOneAndUpdate({"_id":req.body.id},{
       $set:{
           title:req.body.title,
           body:req.body.blog
       }
   })
}
catch(error){
    console.log(error)
}
res.send("done") 
  
})
route.post("/post-draft",async(req,res)=>{
    try{
    await mymodel.findOneAndUpdate({"_id":req.body.id},{
        $set:{
            title:req.body.title,
            body:req.body.blog,
            is_draft:"n"
        }
    })
}
catch(error){
console.log(error)
}
 res.send("done") 
   
 })
route.post("/save-as-draft",async(req,res)=>{
    const data = new mymodel({
            email:"b@b.com",
            is_draft:"y",
            title: req.body.title,

            body:req.body.blog, })
    await data.save()
res.send("") 
  
})
route.post("/post-blog",async(req,res)=>{
    const data = new mymodel({
            email:"b@b.com",
            is_draft:"n",
            title: req.body.title,

            body:req.body.blog, })
    await data.save()
    
res.send("done")
  
})

// route.get('*',(req,res)=>{
//     
//     const nav_send_home=nav_send;
//     nav_send_home.page_title="None";
//     res.render('none.ejs',nav_send);
// })


module.exports = route;

