const express = require('express')
const UserRouter = express.Router()
const Users = require('../models/users.model')
const Blogs = require('../models/blogs.model')
const { hash, compare } = require('bcryptjs');
const { createAccessToken, createRefreshToken } = require('../token');
const multer = require('multer')
const auth = require('../middleware/auth')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else if(file.mimetype === '') {
        cb(new Error('no file'), false)
    } else {
        cb(new Error('failed iupload'), false)
    }
}

const upload = multer({storage, fileFilter})

UserRouter.post('/signup', upload.single('profileImage'), async (req, res) => {
    const { name, email, password, phoneNumber, country } = req.body
    const hashedPassword = await hash(password, 10)
    let userImage = ''
    if(!req.file) {
        console.log('dafault')
        userImage = 'uploads/default-user.png'
    } else {
        console.log('hai pic')
        userImage = req.file.path
    }
    const signUp = new Users({name, email, password: hashedPassword, phoneNumber, country, profileImage: userImage})

    try {
        Users.find({ email: email }, (err, user) => {
            if (user.length) {
                res.status(500).json({message: {
                    msgBody: 'Sorry! User with this email is already registered.',
                    msgError: true
                }})
            } else {
                signUp.save()
                    .then(() => res.status(200).json({message: {
                        msgBody: 'Account Created',
                        msgError: false
                    }
                })
                )
                    .catch(err => res.status(400).json({message: {
                        msgBody: 'Unable to Sign Up',
                        msgError: true
                    }}))
            }
        })
    } catch (err) {
        res.send({
            error: `${err}`,
        })
    }
})

UserRouter.post('/login', (req, res) => {
    const { email, password } = req.body

    Users.find({ email }, async (err, user) => {
        if (!user.length) {
            res.status(500).json({message: {
                msgBody: 'Sorry! No user with this email id exists!',
                msgError: true
            }})
        } else {
            const validPassword = await compare (password, user[0].password)
            if(!validPassword) {
                res.json({message: {
                    msgBody: 'Incorrect Password',
                    msgError: true
                }})
            } else {
                Users.find({ email }, (err, user) => {
                    const accessToken = createAccessToken(user[0].id)
                    const refreshToken = createRefreshToken(user[0].id)
                    res.json({message: {
                        msgBody: 'Logged In',
                        msgError: false,
                        accessToken,
                        refreshToken,
                        user
                    }})
                })
            }
        }
    })
})

UserRouter.get('/', auth, (req, res) => {
    Users.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error ' +err))
})

UserRouter.get('/:id', (req, res) => {
    Users.findById(req.params.id)
        .then(user => {
            Blogs.find({ userId: req.params.id }, (err, blog) => {
                if (!blog.length) {
                    res.status(200).json({message: {
                        userDetail: user,
                        userBlogs: 'Sorry! no blogs',
                        msgError: false
                    }})
                } else {
                    res.json({message: {
                        userDetail: user,
                        userBlogs: blog,
                        msgError: false
                    }})
                }
            })
        })
        .catch(err => res.status(400).json('Error ' +err))
})

UserRouter.post('/updateUser/:id', upload.single('profileImage'), (req, res) => {
    let sameImage = ''
    if(!req.file) {
        Users.findOne({_id: req.params.id}, (err, res) => {
            sameImage = res.profileImage
        })
    }
    Users.findById(req.params.id)
    .then(user => {
            user.name = req.body.name,
            user.email = req.body.email,
            user.phoneNumber = req.body.phoneNumber,
            user.country = req.body.country
            if(typeof req.file === 'undefined') {
                console.log('default = ', sameImage)
                user.profileImage = sameImage
            } else {
                console.log('not default = ', req.file.path)
                user.profileImage = req.file.path
            }
            console.log('userrr - ', user)

            user.save()
                .then(() => res.json({message: {
                    msgBody: 'User Updated',
                    msgError: false
                }}))
                .catch(err => res.status(400).json({message: {
                    msgBody: 'Unable to edit User',
                    msgError: true
                }}))
        })
})

UserRouter.delete('/delete/:id', (req, res) => {
    Users.findByIdAndDelete(req.params.id)
        .then(() => res.json('User Deleted'))
        .catch(err => res.status(400).json('Error '+err))
})

module.exports = UserRouter