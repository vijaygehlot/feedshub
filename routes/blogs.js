const express = require('express')
const BlogsRouter = express.Router()
const Blogs = require('../models/blogs.model')
const Users = require('../models/users.model')
const multer = require('multer')
const auth = require('../middleware/auth')
const pagination = require('../middleware/pagination')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else if (file.mimetype === '') {
        cb(new Error('no file'), false)
    } else {
        cb(new Error('failed upload'), false)
    }
}

const upload = multer({ storage, fileFilter })

BlogsRouter.post('/add', auth, upload.single('bannerImage'), async (req, res) => {
    console.log(req.file)
    if (!req.file) {
        return res.status(500).json({
            message: {
                msgBody: 'Please upload a image',
                msgError: true
            }
        })
    }
    const { title, description, body, author, userId, category } = req.body
    const addBlog = new Blogs({ title, description, body, bannerImage: req.file.path, author, userId, category })

    try {
        Blogs.find({ title: title }, (err, blog) => {
            if (blog.length) {
                res.status(500).json({
                    message: {
                        msgBody: 'Sorry! Blog with this title is already created.',
                        msgError: true
                    }
                })
            } else {
                Users.find({ _id: userId }, (err, user) => {
                    console.log('blog user == ', user)
                    if (!user.length) {
                        res.status(200).json({
                            message: {
                                msgBody: 'Sorry! no user detail found',
                                msgError: false
                            }
                        })
                    } else {
                        addBlog.save()
                            .then(() => res.status(200).json({
                                message: {
                                    msgBody: 'Blog Created',
                                    userDetail: user,
                                    msgError: false
                                }
                            }))
                            .catch(err => res.status(400).json({
                                message: {
                                    msgBody: 'Unable to save Blog',
                                    msgError: true
                                }
                            }))
                    }
                })
            }
        })
    } catch (err) {
        res.send({
            error: `${err}`,
        })
    }
})

BlogsRouter.get('/', pagination(Blogs), (req, res) => {
    Blogs.find()
        .then(() => {
            res.json(res.paginatedResults)
        })
        .catch(err => res.status(400).json('Error ' + err))
})

BlogsRouter.post('/filterCategory/:category', async (req, res) => {
    let category = req.params.category
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await Blogs.countDocuments({ category }).exec()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }

    try {
        if (category === 'all') {
            results.results = await Blogs.find().limit(limit).skip(startIndex).exec()
        } else {
            results.results = await Blogs.find({ category }).limit(limit).skip(startIndex).exec()
        }
        results.totalBlogs = await Blogs.countDocuments({ category }).exec()
        res.paginatedResults = results
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
    Blogs.find()
        .then(() => {
            res.json(res.paginatedResults)
        })
        .catch(err => res.status(400).json('Error ' + err))
})

BlogsRouter.get('/:id', (req, res) => {
    Blogs.findById(req.params.id)
        .then(blogs => res.json(blogs))
        .catch(err => res.status(400).json('Error ' + err))
})

// Delete Specific blog with blog Id
BlogsRouter.delete('/delete/:id', (req, res) => {
    Blogs.findByIdAndDelete(req.params.id)
        .then(() => res.json('Blog Deleted'))
        .catch(err => res.status(400).json('Error ' + err))
})

// Delete User's All Blogs with user Id
BlogsRouter.delete('/deleteUserBlogs/:id', (req, res) => {
    let userId = req.params.id
    Blogs.deleteMany({ userId })
        .then(() => res.json('User Blog Deleted'))
        .catch(err => res.status(400).json('Error ' + err))
})

// Edit Blog
BlogsRouter.post('/update/:id', upload.single('bannerImage'), (req, res) => {
    let sameImage = ''
    if (!req.file) {
        Blogs.findOne({ _id: req.params.id }, (err, res) => {
            sameImage = res.bannerImage
        })
    }
    Blogs.findById(req.params.id)
        .then(blog => {
            blog.title = req.body.title,
            blog.body = req.body.body
            blog.description = req.body.description
            blog.category = req.body.category
            if (typeof req.file === 'undefined') {
                blog.bannerImage = sameImage
            } else {
                blog.bannerImage = req.file.path
            }

            blog.save()
                .then(() => res.json({
                    message: {
                        msgBody: 'Blog Updated',
                        msgError: false
                    }
                }))
                .catch(err => res.status(400).json({
                    message: {
                        msgBody: 'Unable to edit Blog',
                        msgError: true
                    }
                }))
        })
})

BlogsRouter.get('/search/:keyword', (req, res) => {
    const keyword = req.params.keyword
    Blogs.find({ "title": { '$regex': keyword, '$options': 'i' } })
        .then(blogs => res.json(blogs))
        .catch(err => res.status(400).json('Error ' + err))
})

module.exports = BlogsRouter