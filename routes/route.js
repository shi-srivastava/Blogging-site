const express = require('express');
const app = express()
const { isLoggedIn } = require('../middleware');
const route = express.Router();
const mongoose = require("mongoose")
const customId = require("custom-id")
const mymodel = require("../models/blog")
const usermodel = require("../models/user")
const chat_model = require("../models/chat")

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))
const cur_user = require("./username.js")


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
console.log(`AND ... ${cur_user.e} and ${cur_user.b}`)
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
    
    res.render('messages.ejs',{name:"shreya",tag:"5",page_title:"Chat"});
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
    let user = await usermodel.findOne({email:"b@b.com"})
    res.render("demoblog",{blog:doc, user:user,name:"shreya"})
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
route.post("/search", async(req,res)=>{
    
    await usermodel.find({username:{$regex:req.body.data}},{username:1}).then(data=>{
        res.send(data)
    })

})
route.post("/get-room-id", async(req,res)=>{
    console.log(req.body.r)
    let roomID=""
    let doc = await chat_model.find({sender:req.body.sender,receiver:req.body.r})
    if(doc.length == 0){
     roomID = customId({
      sender: req.body.sender,
      receiver: req.body.r
    })
    const data = new chat_model({
        roomID:roomID,
        sender:req.body.sender,
      receiver: req.body.r,

    })

    data.save()
}
else{
    roomID = doc.roomID
}
    res.send(roomID)
    })
    route.post("/get-my-senders", async(req,res)=>{
        console.log(req.body.sender)
     let doc = await chat_model.find({$or:[{sender:req.body.sender},{receiver:req.body.sender}]})
    //  console.log(doc)
     res.send(doc)
    })
    route.post("/get-chats", async(req,res)=>{
     let doc = await chat_model.find({roomID:req.body.roomID})
     doc.forEach(res=>{
        res.chats.forEach(async(chat)=>{

            await chat_model.findOneAndUpdate({roomID:req.body.roomID},
                        {$set:{"chats.$[outer].isRead":"true"}},
                        {"arrayFilters":[{"outer._id":chat._id}]}
                        )
           
        })
     })
    
      res.send(doc)
    })
    route.post("/send-msg", async(req,res)=>{
        console.log(`isread is ${req.body.isRead}`)
        let flag=true
        if(req.body.isRead == 1){
            flag=false
        }
        
      await chat_model.findOneAndUpdate({roomID:req.body.roomID},{
          
          $push:{
              chats:{username:req.body.sender,data:req.body.msg,isRead:flag}
          }
      })
    })
    route.post("/get-unread", async (req,res)=>{
        let doc = await chat_model.find({
            $or:[{sender:req.body.sender},{receiver:req.body.sender}], chats:{$elemMatch:{isRead:false}}
        })
        let rooms =[]
        doc.forEach(doc=>{
            doc.chats.forEach(chat=>{
                if(chat.username != req.body.sender & chat.isRead != true){
                    rooms.push(doc.roomID)
                }
            })
        })
        res.send(rooms)
        //console.log(rooms)
    })
// route.get('*',(req,res)=>{
//     
//     const nav_send_home=nav_send;
//     nav_send_home.page_title="None";
//     res.render('none.ejs',nav_send);
// })


module.exports = route;

