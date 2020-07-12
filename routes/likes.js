const express = require('express')
const LikesRouter = express.Router()
const Likes = require('../models/likes.model')

LikesRouter.post('/like/:id', (req, res) => {
    const liked = JSON.parse(req.query.liked)
    const { userId } = req.body
    const blogId = req.params.id
    const LikesIns = new Likes({ userId, blogId, liked })
    Likes.find({ userId, blogId })
        .then(likes => {
            // console.log('same user likes - ', likes[0].userId)
            console.log('same user - ', userId)
            if(userId === likes[0].userId && blogId === likes[0].blogId) {
                console.log('same user and blog - ')
                Likes.deleteOne({ userId })
                .then(async likes => {
                    const totalLikes = await Likes.countDocuments({ blogId }).exec()
                        console.log('deleted - ', likes)
                        console.log('deleted totalLikes - ', totalLikes)
                        res.json({message: {
                            msgBody: 'deleted',
                            msgError: false,
                            userLiked: false,
                            totalLikes
                        }})
                    })
                    .catch(err => console.log('delete error - ', err))
            } else {
                console.log('not same')
            }
        })
        .catch(err => {
            // console.log('error - ',err)
            // res.status(400).json('Error ' +err)
            LikesIns.save()
            .then(async () => {
                const totalLikes = await Likes.countDocuments({ blogId }).exec()
                    console.log('sucesss')
                    console.log('body - ',typeof liked)
                    res.json({message: {
                        msgBody: 'like added',
                        msgError: false,
                        userLiked: true,
                        totalLikes
                    }})
                })
                .catch(err => {
                    console.log('body store - ',LikesIns)
                    console.log('failed - ', err)
                    res.status(400).json({message: {
                        msgBody: 'Unable to Like',
                        msgError: true
                    }})
                })
        })
})

LikesRouter.get('/showlikes', (req, res) => {
    Likes.find()
        .then(likes => res.json(likes))
        .catch(err => res.status(400).json('Error ' +err))
})

LikesRouter.get('/showlikes/:id', async (req, res) => {
    const blogId = req.params.id
    const totalLikes = await Likes.countDocuments({ blogId }).exec()
    Likes.find({ blogId })
        .then(likes => res.json({message: {
            likes,
            totalLikes
        }}))
        .catch(err => res.status(400).json('Error ' +err))
})

// Delete User's All Likes with user Id
LikesRouter.delete('/deleteUserLikes/:id', (req, res) => {
    let userId = req.params.id
    Likes.deleteMany({ userId })
        .then(() => res.json('User Likes Deleted'))
        .catch(err => res.status(400).json('Error ', err))
})

module.exports = LikesRouter