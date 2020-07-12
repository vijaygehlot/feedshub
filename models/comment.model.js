const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentsModel = new Schema({
    comment: {
        type: String,
        required: 'Comment is required'
    },
    userId: {
        type: String,
        required: 'User Id is required'
    },
    blogId: {
        type: String,
        required: 'Blog Id is required'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comments', CommentsModel)