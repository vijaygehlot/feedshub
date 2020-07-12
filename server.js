const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
// const PORT = process.env.PORT || 5000
const PORT = process.env.PORT || 8000

require('dotenv').config()

app.use('/uploads', express.static('uploads'))
app.use(bodyParser.json())
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }))

//Routes
const users = require('./routes/users')
const blogs = require('./routes/blogs')
const comments = require('./routes/comments')
const likes = require('./routes/likes')
app.use('/blogs/users', users)
app.use('/blogs', blogs)
app.use('/blogs/comments', comments)
app.use('/blogs/likes', likes)


const localUri = "mongodb+srv://vijaygehlot208:vnjXbVy977FtK4t@cluster0.kyvp4.mongodb.net/test?retryWrites=true&w=majority"
//  username:vijaygehlot208  password: vnjXbVy977FtK4t
//mongoose.connect('mongodb://localhost:27017/blogs', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (err) => {


mongoose.connect(process.env.MONGODB_URI || localUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (err) => {
    if (err) {
        console.log('err - ', err)
        process.exit(1);
        console.log('Unable to connect to database')
    } else {
        console.log('MongoDb database connected')
    }
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('front-end/build'))
    // app.use(express.static(path.join(__dirname, 'front-end', 'build')));

    app.get('*', (req, res) => {
        // res.sendFile(path.join(__dirname, 'front-end', 'build', 'index.html'))
        res.sendFile(path.join(__dirname, 'front-end/build', 'index.html'));
    });
}
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})