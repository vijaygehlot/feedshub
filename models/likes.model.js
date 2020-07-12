const mongoose = require('mongoose');
const Schema = mongoose.Schema

const LikesModel = new Schema({
    liked: {
        type: Boolean,
        default: false
    },
    blogId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Likes', LikesModel)