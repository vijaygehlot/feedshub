const express = require('express')
const CommentsRouter = express.Router()
const Comments = require('../models/comment.model')

CommentsRouter.post('/add/:id', (req, res) => {
    const { comment, userId } = req.body
    const blogId = req.params.id
    const commentIns = new Comments({ comment, userId, blogId })
    commentIns.save()
        .then(() => {
                console.log('sucesss')
                res.json({message: {
                msgBody: 'Comment added',
                msgError: false
            }})
        })
        .catch(err => {
            console.log('failed')
            res.status(400).json({message: {
            msgBody: 'Unable to add comment',
            msgError: true
        }})
    })
})

CommentsRouter.get('/showcomments', (req, res) => {
    Comments.find()
        .then(comment => res.json(comment))
        .catch(err => res.status(400).json('Error ' +err))
})

//Show particular comment passing comment id in params
CommentsRouter.get('/showcomments/:id', (req, res) => {
    Comments.find({_id: req.params.id})
        .then(comment => res.json({comment, msgError: false}))
        .catch(err => res.status(400).json({message: {
            msgBody: 'No comments found',
            msgError: true
        }}))
})

//Show comments for particular blog passing bog id in params
CommentsRouter.get('/showblogcomments/:id', async (req, res) => {
    const blogId = req.params.id
    const totalComments = await Comments.countDocuments({ blogId }).exec()
    Comments.find({ blogId })
        .then(comment => res.json({comment,totalComments, msgError: false}))
        .catch(err => res.status(400).json({message: {
            msgBody: 'No comments found',
            msgError: true
        }}))
})

// Delete Specific comment with user Id
CommentsRouter.delete('/deletecomment/:id', (req, res) => {
    Comments.findByIdAndDelete(req.params.id)
        .then(() => res.json('Comment Deleted'))
        .catch(err => res.status(400).json('Error '+err))
})

// Delete User's All Comments with user Id
CommentsRouter.delete('/deleteUserComments/:id', (req, res) => {
    let userId = req.params.id
    Comments.deleteMany({ userId })
        .then(() => res.json('User Comments Deleted'))
        .catch(err => res.status(400).json('Error ', err))
})

CommentsRouter.post('/updatecomment/:id', (req, res) => {
    Comments.findById(req.params.id)
        .then(comment => {
            comment.comment = req.body.comment

            comment.save()
                .then(() => res.json({message: {
                    msgBody: 'Comment Updated',
                    msgError: false
                }}))
                .catch(err => res.status(400).json({message: {
                    msgBody: 'Unable to edit Comment',
                    msgError: true
                }}))
        })
})

module.exports = CommentsRouter