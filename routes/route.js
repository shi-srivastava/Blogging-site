const express = require('express');
const app = express()
const { isLoggedIn } = require('../middleware');
const route = express.Router();
const mongoose = require("mongoose")
const customId = require("custom-id")
const mymodel = require("../models/blog")
const usermodel = require("../models/user")
const chat_model = require("../models/chat")
const moment = require("moment")

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))
let cur_user = ""
//need to change nav_send name to something else, as 'name' key is passed in demoblog as
//well


const nav_send ={"name":"s","tag":"h"}
route.get('/login',isLoggedIn,(req,res,next)=>{
    res.clearCookie("email")
   res.render("login_signup")
})

route.get('/home',isLoggedIn, async(req,res,next) =>{

cur_user = req.cookies['email']
await mymodel.find().sort({score:-1}).then(data=>{
    res.render("home",{name:cur_user,page_title:"Home",tag:"5 star",blogs:data})
})

})
route.get("/get-trending",async(req,res)=>{
    await mymodel.find().sort({score:-1}).then(data=>{
        res.send(data)
    })
})
route.get('/temp', (req,res,next) =>{
    
    const nav_send_home=nav_send;
    nav_send_home.page_title="Home";
    
    console.log("Route to home");
    res.render('temp_home.ejs',nav_send);
})
route.get('/profile',async(req,res,next) =>{
    try{
    let doc = await mymodel.find({email:req.cookies['email'],is_draft:"n"})
res.render('profile',{blog:doc,name:cur_user,tag:"5 star",page_title:"profile"});
    }
    catch(error){
console.log(error);
    }
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
route.get('/messages',async(req,res,next) =>{
    console.log("ent msgs")
   let user = await usermodel.find({email:req.cookies['email']})
   user = await usermodel.findById({_id:user[0]._id})
    res.render('messages.ejs',{username:user.username,name:cur_user,tag:"5",page_title:"Chat"});
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
    let doc = await mymodel.find({email:cur_user, is_draft:"y"})

    res.render('your-pokis.ejs',{blog:doc,name:cur_user,tag:"jnln",page_title:"pokis"});
})
route.get('/trending',(req,res,next) =>{
    
    res.render('trending.ejs',nav_send);
})
route.get('/your-projects',(req,res,next) =>{
    
    res.render('trending.ejs',{name:req.cookies['email'],tag:"jnln",page_title:"pokis"});
})

// route.get('/demo-blog',async (req,res,next)=>{
//     let doc = await mymodel.findById("611623d34d5e6f239ce82de2")
//     const nav_send_home=nav_send;
//     nav_send_home.page_title="DEMOBlogDisplay";
//     // let uid = await usermodel.find({email:req.params.name}) 
//     let user = await usermodel.findById({_id:"6109179f640e3939902b5f3d"})
//     res.render("demoblog",{blog:doc,user:user,name:cur_user,tag:"jnln",page_title:"demo"})
// })
route.get('/your-pokis-created',(req,res,next) =>{
    
    res.render('your-pokis-created',{name:req.cookies['email'],tag:"jnln",page_title:"pokis"});
})
route.get('/create-blog',async(req,res) =>{
    res.render('create-blog.ejs',{name:req.cookies['email'],tag:"5 star"});
})
route.get("/sending-user-for-mention", async(req,res)=>{
    let doc = await usermodel.find({},{username:1})
res.send(doc)
})
route.get("/draft_edit/:id",async(req,res)=>{
    let doc = await mymodel.findById(req.params.id)
    res.render("draft_edit",{blog:doc})
})
route.get("/edit_post/:id",async(req,res)=>{
    let doc = await mymodel.findById(req.params.id)
    res.render("editblogafterpost",{blog:doc})
})
route.get("/demoblog/:id",async(req,res)=>{
    let doc = await mymodel.findById(req.params.id)
   let user = await usermodel.find({email:req.cookies['email']})
    user = await usermodel.findById({_id:user[0]._id})
   
    res.render("demoblog",{name:user.username,blog:doc,user:user,email:req.cookies['email']})
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
            email:req.cookies['email'],
            is_draft:"y",
            title: req.body.title,

            body:req.body.blog, })
    await data.save()
res.send("") 
  
})
route.post("/post-blog",async(req,res)=>{
    const data = new mymodel({
            email:req.cookies['email'],
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
route.post("/search-on-homepage", async(req,res)=>{
    if((req.body.filter)=="blog"){
        // console.log("dfkjnlfnd")
    await mymodel.find({title:{$regex:req.body.data}},{title:1}).then(data=>{
        res.send(data)
    })
}
else{
    await usermodel.find({username:{$regex:req.body.data}},{username:1}).then(data=>{
        res.send(data)
    })
}
})
route.get("/profile/:id", async(req,res)=>{
    console.log("this is"+req.cookies['email'])
    let user = await usermodel.findById(req.params.id)
    try{
        let doc = await mymodel.find({email:req.cookies['email'],is_draft:"n"})
    res.render('profile',{blog:doc,name:req.cookies['email'],tag:"jnln",page_title:"profile"});
        }
        catch(error){
    console.log(error);
        }
})
route.post("/get-room-id", async(req,res)=>{
    console.log(req.body.r)
    let roomID=""
    let user = await usermodel.find({username:req.body.r})
    if(user.length >0){
    let doc = await chat_model.find({$or:[{sender:req.body.sender,receiver:req.body.r},{sender:req.body.r,receiver:req.body.sender}]})
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
}
    })
    
    route.post("/get-my-senders", async(req,res)=>{
        console.log(req.body.sender)
    //  let doc = await chat_model.find({$or:[{sender:req.body.sender},{receiver:req.body.sender}]})
    let doc = await chat_model.find({$or:[{receiver:req.body.sender},{sender:req.body.sender}]})
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
    route.post("/delete-chat",async(req,res)=>{
        try{
        await chat_model.remove({roomID:req.body.roomID})
        res.send("done")
        }
        catch(error){
            console.log(error)
        }
    })
    route.post("/send-msg", async(req,res)=>{
        console.log(`isread is ${req.body.isRead}`)
        let flag=true
        if(req.body.isRead == 1){
            flag=false
        }
        let d = new Date()
        let s = ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
        
        // let flag = false
      await chat_model.findOneAndUpdate({roomID:req.body.roomID},{
          
          $push:{
              chats:{username:req.body.sender,data:req.body.msg,isRead:flag,date:s+" "+d.toLocaleTimeString()}
          }
      })
      res.send("")
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
    //COMMENTS AND REPLIES
    route.post("/do-comment",async (req,res)=>{
    
     let doc=await mymodel.findOneAndUpdate({_id: req.body.id},
        {
           $push:{
            comment:{
                email:req.body.email,
                data : req.body.comment
            }
           }
        },
        {new:true})
        let score = doc.score
     await mymodel.findOneAndUpdate(
            {  _id: req.body.id },
            {$set:{"score":(score+1)*0.2 }},
            
         )
         let user = await usermodel.find({email:req.cookies['email']})
         user = await usermodel.findByIdAndUpdate({_id:user[0]._id},{
            $push:{comments_made:doc.comment[doc.comment.length - 1]._id} 
         },{new:true})
        
       res.send(`done`)
    
    })
    route.post("/do-reply",async (req,res)=>{
        
        console.log(`${req.body.cid} and ${req.body.reply}`)
        
       
        let doc =await mymodel.findOneAndUpdate({"comment._id": req.body.cid},
           {
             $push:{
                 "comment.$.reply":{
                     data: req.body.reply,
                     email:req.body.email
                 }
            } },
            {new:true})
            //doc.comment.reply.length doesn't work, so how to know the number of replies?
            let score = doc.score
            await mymodel.findOneAndUpdate(
                {  _id: req.body.id },
                {$set:{"score":(score+1)*0.2 }},
                
             )
            
            let i=0
            doc.comment.every(com=>{
                
                if(com._id == req.body.cid){
                    return i
                }
                i++
            })
            console.log(doc.comment[i].reply[doc.comment[i].reply.length - 1]._id)
            let user = await usermodel.find({email:req.cookies['email']})
            user = await usermodel.findByIdAndUpdate({_id:user[0]._id},{
                $push:{
                    comments_made:doc.comment[i].reply[doc.comment[i].reply.length - 1]._id
                }
            })
           
            res.send("replied")
    })
    route.post("/do-like",async(req,res)=>{
      console.log("like")
    
         await mymodel.findOneAndUpdate(
            {  _id: req.body.data },
            {$set:{"comment.$[outer].reply.$[inner].likes":req.body.likes}},
            {"arrayFilters":[{"outer._id":req.body.cid},{"inner._id":req.body.rid}]}
         )
         
         if(req.body.flag==1){
             console.log("flag is 1")
            await usermodel.findOneAndUpdate({email : req.body.email},
                {$push:{"liked_comments":req.body.rid
                         
                    }})
             }
        else{
            await usermodel.findOneAndUpdate({email : req.body.email},
                {$pull:{"liked_comments":req.body.rid
                        
                    }})
        }
            res.send("likes")
    
    })
    route.post("/comments-like",async(req,res)=>{
    
        console.log(req.body.flag)
        await mymodel.findOneAndUpdate({_id:req.body.data},
            {$set:{"comment.$[outer].likes":req.body.likes}},
            {"arrayFilters":[{"outer._id":req.body.cid}]}
            )
        let user = await usermodel.find({email:req.cookies['email']})
        
            if(req.body.flag==1){
                await usermodel.findByIdAndUpdate({_id:user[0]._id},
                    {$push:{
                        liked_comments:req.body.cid
               }})
            
            }
            
            else{
                await usermodel.findByIdAndUpdate({_id:user[0]._id},
                    {$pull:{
                             liked_comments:req.body.cid
                    }})
            }
           
            res.send("comment liked")
    })
    
    route.post("/post-edited-comment", async(req,res)=>{
       
        
        await mymodel.findOneAndUpdate({_id:req.body.data},
            {$set:{"comment.$[outer].data":req.body.comment}},
            {"arrayFilters":[{"outer._id":req.body.cid}]}
            )
        
        res.send("edited")
    })
    route.post("/post-edited-reply", async(req,res)=>{
       
        
        await mymodel.findOneAndUpdate({_id:req.body.data},
            {$set:{"comment.$[outer].reply.$[inner].data":req.body.comment}},
            {"arrayFilters":[{"outer._id":req.body.cid},{"inner._id":req.body.rid}]}
            )
        
        res.send("edited reply")
    })
    route.post("/delete-com",async(req,res)=>{
        await mymodel.findOneAndUpdate({_id:req.body.blog_id},
            {
                $pull:{"comment":{_id:req.body.cid}}
            })
            let i=0
            let user = await usermodel.find({email:req.cookies['email']})
            let doc = await usermodel.findById({_id:user[0]._id})
       
        doc.comments_made.every(id=>{
            if(id == req.body.cid){
                return i
            }
            i++
        })
        doc.comments_made.splice(i,1)
         await usermodel.findByIdAndUpdate({_id:user[0]._id},
            {
                $set:{comments_made:doc.comments_made}
            })
       
      
        res.send("deleted")
    })
    route.post("/delete-reply", async(req,res)=>{
        await mymodel.findOneAndUpdate({_id:req.body.blog_id},
            {$pull:{"comment.$[outer].reply":{_id:req.body.rid}}},
            {"arrayFilters":[{"outer._id":req.body.cid}]}
            )
            let user = await usermodel.find({email:req.cookies['email']})
            let doc = await usermodel.findById({_id:user[0]._id})
            let i=0
            console.log(doc.comments_made)
            doc.comments_made.forEach(id=>{
                // console.log(`${id} and ${req.body.rid}`)
                if(id == req.body.rid){
                    console.log(`${id} and ${req.body.rid}`)
                    return i
                }
                i++
            })
            console.log(`is is ${i}`)
            doc.comments_made.splice(i,1)
            await usermodel.findByIdAndUpdate({_id:user[0]._id},
                {
                    $set:{comments_made:doc.comments_made}
                })
          
            res.send("deleted")
    })
    route.post("/blog-like",async(req,res)=>{
       
        await mymodel.findOneAndUpdate({"_id":req.body.id},
        {
            $set:{"score":(req.body.value + 1)*0.2,"blog_likes": req.body.value}
        })
        if(req.body.flag == 1){
        await usermodel.findOneAndUpdate({email:req.body.email},{
           $push:{liked_blogs:req.body.id} 
        })
    }
    else{
        await usermodel.findOneAndUpdate({email:req.body.email},{
            $pull:{liked_blogs:req.body.id} 
         })
    }
    res.send("blog liked")
    })
    
// route.get('*',(req,res)=>{
//     
//     const nav_send_home=nav_send;
//     nav_send_home.page_title="None";
//     res.render('none.ejs',nav_send);
// })

module.exports = route;

