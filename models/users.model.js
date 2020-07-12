const mongoose = require('mongoose')
const Schema = mongoose.Schema

let validateEmail = function(email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UsersSchema = new Schema({
    name: {
        type: String,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        lowercase: true, 
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    phoneNumber: {
        type: Number,
        required: 'Phone Number is required'
    },
    country: {
        type: String,
        required: 'Country is required'
    },
    date: {
        type: Date,
        default: Date.now   
    },
    profileImage: {
        type: String,
        // required: 'Image is required'
    }
})

module.exports = mongoose.model('SignUp', UsersSchema)