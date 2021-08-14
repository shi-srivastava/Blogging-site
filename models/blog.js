const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    email: {
        type: String
    },
    title: {
        type: String
    },
    body: {
        type: Object
    },
    blog_likes: {
        type: Number,
        default: 0
    },
    blog_views: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    comment: [{
        email: {
            type: String
        },
        image: {
            type: String
        },
        data: {
            type: String
        },
        likes: {
            type: Number,
            default: 0
        },
        reply: [{
            email: {
                type: String
            },
            image: {
                type: String
            },
            data: {
                type: String
            },
            likes: {
                type: Number,
                default: 0
            }
        }]
    }]
})

module.exports = mongoose.model('Blog', BlogSchema);