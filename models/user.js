const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
let d = new Date()
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password cannot be empty!!']
    },
    image: {
        type: String
    },
    liked_comments: {
        type: Array
    },
    comments_made: {
        type: Array
    },
    myBlogId: {
        type: Array
    },
    liked_blogs: {
        type: Array
    },
    followers:{type:Array},
    following:{type:Array},
    notif:[{
        type:{type:String},
        name:{type:String},
        blog:{type:String},
        date:{type:String, default: ""+d.getDate()+"-"+d.getMonth()+1+"-"+d.getFullYear()}
    }],
    notif_status:{type:Number,default:0}
    
})
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);