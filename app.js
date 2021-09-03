const express = require('express');
const mongoose = require('mongoose');
const socket = require("socket.io")
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const server = app.listen(3000, () => {
    console.log('At your service!!')
})
const io = socket(server)


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

let cur_user="";

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
app.get("/favicon.ico", (req, res) => {
    res.sendStatus(404);
});
const userRoutes = require('./routes/users');
   const mainRoute = require('./routes/route');
   passport.serializeUser((user, done) => done(null, user._id))
   passport.deserializeUser(async (id, done) => {
       done(null, User.findById(id))
   })
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
                // send_data(cur_user)
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
const send_data=(a)=>{
    console.log(`VAL IS ${cur_user}`)
    module.exports={e:a,b:"yo"}

}
// module.exports = {e:cur_user,b:"yo"}

io.on("connection",(socket)=>{
    socket.on("join-room",data=>{
        if(data.prev_room != "nothing"){
        socket.leave(data.prev_room)
        console.log("left "+data.prev_room)
        }
      socket.join(data.room)
      console.log("joined room"+data.room)
      
    })
   socket.on("get-clients-no",room=>{
       let clientNumber = io.sockets.adapter.rooms.get(room).size
       console.log(clientNumber)
       socket.emit("get-clients-no",clientNumber)
   })
     socket.on("express-chat",data=>{
   
       socket.to(data.roomID).emit("express-chat",(data))
     })
    //  socket.on('disconnect',()=>{
    //      console.log("disconnected")
    //  })
     
   
   })
   

   
   
   app.use('/',userRoutes);
   app.use(mainRoute);



