const express = require('express');
const mongoose = require('mongoose');
const app = express();

const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');

const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');
const Blog = require('./models/blog');

const userRoutes = require('./routes/users');
const mainRoute = require('./routes/route');

mongoose.connect('mongodb://localhost:27017/blogg', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!!");
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'iamthebestdeveloper!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: 'email'
},
    async (email, password, done) => {
        const user = await User.findOne({ email: email });
        if (user == null) {
            return done(null, false, { message: 'No user registered with that email' })
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log('success')
                return done(null, user)
            } else {
                return done(null, false, {
                    message: 'incorrect password'
                })
            }
        } catch (e) {
            return done(e)
        }
    }
));
passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser(async (id, done) => {
    done(null, User.findById(id))
})

app.use('/',userRoutes);
app.use(mainRoute);



// app.get('/', isLoggedIn, async (req, res) => {
//     //req.flash('success', "successfully reached to home page!!");
//     // await mymodel.find().sort({score:-1}).then(data=>{
//         // res.render('home',{blogs:data})
//     res.render('home');
//     // })
// })

// app.get("/get-trending",async(req,res)=>{
//     await mymodel.find().sort({score:-1}).then(data=>{
//         res.send(data)
//     })
// })

// app.get("/new",(req,res)=>{
//     res.render("new")
// })

// app.post("/output",async(req,res)=>{
   
//     const data = new mymodel({
        
            
//             title: req.body.title,

//             body:req.body.editor,
        
        
//     })
//     await data.save();
//     res.redirect("/");
  
// })
// app.get("/blog/:name/:image/:id",async (req,res)=>{
//      let doc = await mymodel.findById(req.params.id)
//     let uid = await usermodel.find({email:req.params.name}) 
//     let user = await usermodel.findById({_id:uid[0]._id})
//     res.render("blog",{blog:doc,user:user,name:req.params.name,image:req.params.image})
// })

// app.post("/do-comment",async (req,res)=>{
    
//     console.log(req.body.comment)
//  let doc=await mymodel.findOneAndUpdate({_id: req.body.id},
//     {
//        $push:{
//         comment:{
//             email:req.body.email,
//             data : req.body.comment
//         }
//        }
//     },
//     {new:true})
//     let score = doc.score
//  await mymodel.findOneAndUpdate(
//         {  _id: req.body.id },
//         {$set:{"score":(score+1)*0.2 }},
        
//      )
//     await usermodel.findOneAndUpdate({email:req.body.email},
//         {
//             $push:{
//                 comments_made:doc.comment[doc.comment.length-1]._id
//             }
//         })
     
//    res.send(`done`)

// })
// app.post("/do-reply",async (req,res)=>{
    
//     console.log(`${req.body.cid} and ${req.body.reply}`)
//     let doc =await mymodel.findOneAndUpdate({"comment._id": req.body.cid},
//        {
//          $push:{
//              "comment.$.reply":{
//                  data: req.body.reply,
//                  email:req.body.email
//              }
//         } },
//         {new:true})

//         let score = doc.score
//         await mymodel.findOneAndUpdate(
//             {  _id: req.body.id },
//             {$set:{"score":(score+1)*0.2 }},
            
//          )
        
//         let i=0
//         doc.comment.every(com=>{
            
//             if(com._id == req.body.cid){
//                 return i
//             }
//             i++
//         })
        
//        await usermodel.findOneAndUpdate({email:req.body.email},
//         {
//             $push:{
//                 comments_made:doc.comment[i].reply[doc.comment[i].reply.length - 1]._id
//             }
//         })
//         res.send("replied")
// })
// app.post("/do-like",async(req,res)=>{
//   console.log("like")

//      await mymodel.findOneAndUpdate(
//         {  _id: req.body.data },
//         {$set:{"comment.$[outer].reply.$[inner].likes":req.body.likes}},
//         {"arrayFilters":[{"outer._id":req.body.cid},{"inner._id":req.body.rid}]}
//      )
     
//      if(req.body.flag==1){
//          console.log("flag is 1")
//         await usermodel.findOneAndUpdate({email : req.body.email},
//             {$push:{"liked_comments":req.body.rid
                     
//                 }})
//          }
//     else{
//         await usermodel.findOneAndUpdate({email : req.body.email},
//             {$pull:{"liked_comments":req.body.rid
                    
//                 }})
//     }
//         res.send("likes")

// })
// app.post("/comments-like",async(req,res)=>{

//     console.log(req.body.flag)
//     await mymodel.findOneAndUpdate({_id:req.body.data},
//         {$set:{"comment.$[outer].likes":req.body.likes}},
//         {"arrayFilters":[{"outer._id":req.body.cid}]}
//         )
//         if(req.body.flag==1){
//         await usermodel.findOneAndUpdate({email:req.body.email},
//             {$push:{
//                      liked_comments:req.body.cid
//             }})
//         }
        
//         else{
//             await usermodel.findOneAndUpdate({email:req.body.email},
//                 {$pull:{
//                          liked_comments:req.body.cid
//                 }})
//         }
       
//         res.send("comment liked")
// })

// app.post("/post-edited-comment", async(req,res)=>{
   
    
//     await mymodel.findOneAndUpdate({_id:req.body.data},
//         {$set:{"comment.$[outer].data":req.body.comment}},
//         {"arrayFilters":[{"outer._id":req.body.cid}]}
//         )
    
//     res.send("edited")
// })
// app.post("/post-edited-reply", async(req,res)=>{
   
    
//     await mymodel.findOneAndUpdate({_id:req.body.data},
//         {$set:{"comment.$[outer].reply.$[inner].data":req.body.comment}},
//         {"arrayFilters":[{"outer._id":req.body.cid},{"inner._id":req.body.rid}]}
//         )
    
//     res.send("edited reply")
// })
// app.post("/delete-com",async(req,res)=>{
//     await mymodel.findOneAndUpdate({_id:req.body.blog_id},
//         {
//             $pull:{"comment":{_id:req.body.cid}}
//         })
        
//     let doc = await usermodel.findOne({email:req.body.email})
//     let i=0
//     doc.comments_made.every(id=>{
//         if(id == req.body.cid){
//             return i
//         }
//         i++
//     })
//     doc.comments_made.splice(i,1)
//     await usermodel.findOneAndUpdate({email:req.body.email},
//         {
//             $set:{comments_made:doc.comments_made}
//         })
  
//     res.send("deleted")
// })
// app.post("/delete-reply", async(req,res)=>{
//     await mymodel.findOneAndUpdate({_id:req.body.blog_id},
//         {$pull:{"comment.$[outer].reply":{_id:req.body.rid}}},
//         {"arrayFilters":[{"outer._id":req.body.cid}]}
//         )
//         let doc = await usermodel.findOne({email:req.body.email})
//         let i=0
//         console.log(doc.comments_made)
//         doc.comments_made.forEach(id=>{
//             // console.log(`${id} and ${req.body.rid}`)
//             if(id == req.body.rid){
//                 console.log(`${id} and ${req.body.rid}`)
//                 return i
//             }
//             i++
//         })
//         console.log(`is is ${i}`)
//         doc.comments_made.splice(i,1)
//         await usermodel.findOneAndUpdate({email:req.body.email},
//             {
//                 $set:{comments_made:doc.comments_made}
//             })
      
//         res.send("deleted")
// })
// app.post("/blog-like",async(req,res)=>{
   
//     await mymodel.findOneAndUpdate({"_id":req.body.id},
//     {
//         $set:{"score":(req.body.value + 1)*0.2,"blog_likes": req.body.value}
//     })
//     if(req.body.flag == 1){
//     await usermodel.findOneAndUpdate({email:req.body.email},{
//        $push:{liked_blogs:req.body.id} 
//     })
// }
// else{
//     await usermodel.findOneAndUpdate({email:req.body.email},{
//         $pull:{liked_blogs:req.body.id} 
//      })
// }
// res.send("blog liked")
// })

// app.post("/search", async(req,res)=>{
//     if((req.body.filter)=="blog"){
//         console.log("dfkjnlfnd")
//     await mymodel.find({title:{$regex:req.body.data}},{title:1}).then(data=>{
//         res.send(data)
//     })
// }
// else{
//     await usermodel.find({email:{$regex:req.body.data}},{email:1}).then(data=>{
//         res.send(data)
//     })
// }
// })

app.listen(3000, () => {
    console.log('At your service!!')
})