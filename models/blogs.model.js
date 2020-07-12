const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BlogsModel = new Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    description: {
        type: String,
        required: 'Short description is required'
    },
    body: {
        type: String,
        required: 'Body is required'
    },
    date: {
        type: Date,
        default: Date.now   
    },
    bannerImage: {
        type: String,
    },
    userId: {
        type: String,
        required: 'User Id is required'
    },
    userDetail: {
        type: String
    },
    category: {
        type: String,
        required: 'Category is required'
    }
})

module.exports = mongoose.model('Blogs', BlogsModel)