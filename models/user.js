const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

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
    }
})
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);