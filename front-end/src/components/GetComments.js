import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom';
import { Button, Modal, ModalBody } from 'reactstrap'
import { useSelector } from "react-redux";
import axios from 'axios';
import qs from 'query-string';

export const GetCommentBy = ({ id }) => {
    const [comments, setComments] = useState([])
    const [totalComments, setTotalComments] = useState(0)
    const _isMounted = useRef(true);

    useEffect(() => {
        axios.get(`blogs/comments/showblogcomments/${id}`)
            .then(res => {
                if (_isMounted.current) {
                    setComments(res.data.comment)
                    setTotalComments(res.data.totalComments)
                }
            })
            .catch(err => console.log('error comment - ', err.response))
    }, [id])

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, [])

    const showComment = () => {
        return comments.map(comment => {
            return (
                <div className="comment-container" key={comment._id}>
                    <GetUserInfo userId={comment.userId} comment={comment.comment} commentId={comment._id} />
                </div>
            )
        })
    }

    return (
        <>
            {totalComments === 0 ? <p className="text-center">This Blog has no comments yet</p> : showComment()}
        </>
    )
}

// Show total comment on Blogs page
export const GetTotalComments = props => {
    const [totalCommentsCount, setTotalCommentsCount] = useState(0)

    useEffect(() => {
        axios.get(`/blogs/comments/showblogcomments/${props.id}`)
            .then(res => {
                setTotalCommentsCount(res.data.totalComments)
            })
            .catch(err => console.log(err))
    }, [props.id])

    return (
        <>
            {totalCommentsCount === 0 ? <p><i className="far fa-comment"></i> : No Comment</p> : <p><i className="far fa-comment"></i> : {totalCommentsCount}</p>}
        </>
    )
}

export const GetUserInfo = props => {
    const [userDetailArr, setUserDetailArr] = useState(null)
    const [editComment, setEditComment] = useState(false)
    const [newEditComment, setNewEditComment] = useState('')
    const { userId, commentId } = props

    useEffect(() => {
        const token = localStorage.getItem('Token')
        let config = {
            headers: {
                'x-auth-header': token,
            }
        }
        axios.get(`/blogs/users/${userId}`, config)
            .then(res => {
                setUserDetailArr(res.data.message.userDetail)
            })
            .catch(err => console.log(err.response))
    }, [userId])

    const sameUser = useSelector(state => {
        if (state.userExist !== false) {
            return state.Name[0].message.userDetail._id
        }
    })

    const deleteComment = () => {
        axios.delete(`/blogs/comments/deletecomment/${commentId}`)
            .then(res => window.location.reload())
            .catch(err => console.log('delete error - ', err))
    }

    const updateComment = () => {
        axios.get(`/blogs/comments/showcomments/${commentId}`)
            .then(res => {
                setEditComment(true)
                setNewEditComment(res.data.comment[0].comment)
            })
            .catch(err => console.log('update error - ', err))
    }

    const postNewComment = () => {
        const commentDetail = {
            comment: newEditComment
        }
        axios.post(`/blogs/comments/updatecomment/${commentId}`, qs.stringify(commentDetail))
            .then(res => {
                setEditComment(false)
                window.location.reload()
            })
            .catch(err => console.log(err.response))
    }

    return (
        <>
            <div className="comment-image">
                <img className="w-100 h-100" src={userDetailArr && userDetailArr.profileImage} alt="user-profile" />
            </div>
            <div className="comment-body">
                <p className="comment-user"><Link color="primary" to={`/user-profile${userId}`}>{userDetailArr && userDetailArr.name}</Link></p>
                {editComment ? (
                    <div className="blog-add-comment">
                        <input type="text" className="form-control" value={newEditComment} onChange={e => setNewEditComment(e.target.value)} />
                        <Button className="btn btn-info btn-comment" onClick={() => postNewComment()}><i className="far fa-paper-plane"></i></Button>
                    </div>
                ) : <p className="comment-content">{props.comment}</p>}
                <div className="comment-actions">
                    {userId === sameUser ? <p className="comment-btn comment-delete" onClick={() => deleteComment()}>Delete</p> : null}
                    {userId === sameUser ? <p className="comment-btn comment-update" onClick={() => updateComment()}>Update</p> : null}
                </div>

            </div>
        </>
    )
}

// Show Likes on ReadBlog page
export const GetLikes = ({ id, blog, blogId }) => {
    const [tokenExist, setTokenExist] = useState(false)
    const [totalLikes, setTotalLikes] = useState(0)
    const [totalCommentsCount, setTotalCommentsCount] = useState(0)
    const [usersLikedBlog, setUsersLikedBlog] = useState(null)
    const [modal, setModal] = useState(false)
    const _isMounted = useRef(true)
    let userLiked = false

    const userId = useSelector(state => {
        if (state.userExist !== false) {
            return state.Name[0].message.userDetail._id
        }
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('Token')
        if (token !== null) {
            setTokenExist(true)
        }

        axios.get(`blogs/likes/showlikes/${id}`)
            .then(res => {
                if (_isMounted.current) {
                    setTotalLikes(res.data.message.totalLikes)
                    setUsersLikedBlog(res.data.message.likes)
                }
            })
            .catch(err => console.log(err))

        axios.get(`/blogs/comments/showblogcomments/${id}`)
            .then(res => {
                if (_isMounted.current) {
                    setTotalCommentsCount(res.data.totalComments)
                }
            })
            .catch(err => console.log(err))

    }, [id, totalLikes])

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    usersLikedBlog && usersLikedBlog.map(users => {
        if (users.userId === userId) {
            userLiked = true
        }
    })

    const handleLike = id => {
        if (!tokenExist) {
            toggle()
        } else {
            const likeDetail = {
                userId
            }
            axios.post(`blogs/likes/like/${id}?liked="true"`, qs.stringify(likeDetail))
                .then(res => {
                    setTotalLikes(res.data.message.totalLikes)
                    userLiked = res.data.message.userLiked
                })
                .catch(err => console.log('error - ', err))
        }
    }

    const toggle = () => setModal(!modal);

    const ModalPopUp = () => {
        return (
            <Modal isOpen={modal} toggle={toggle}>
                <ModalBody>
                    <span onClick={toggle}><i className="fas fa-times"></i></span>
                    You need To login. <br />
                    <Link to="/login">Login Now</Link>. <br />
                    <hr className="my-2" />
                    Don't have an account ? <br />
                    <Link to="/signup">Sign Up</Link>
                </ModalBody>
            </Modal>
        )
    }

    return (
        <div className="blog-likes">
            {ModalPopUp()}
            <Button className="btn-like" onClick={(id) => handleLike(blogId)}>{userLiked ? <i className="far fa-heart user-liked"></i> : <i className="far fa-heart"></i>}</Button>
            <span>{totalLikes} Likes</span>
            <span className="blog-comments"><i className="far fa-comment"></i>  {totalCommentsCount} Comments</span>
        </div>
    )
}

// Show Total likes count on Blogs Page
export const GetTotalLikes = props => {
    const [totalLikesCount, setTotalLikesCount] = useState(0)

    useEffect(() => {
        axios.get(`/blogs/likes/showlikes/${props.id}`)
            .then(res => {
                setTotalLikesCount(res.data.message.totalLikes)
            })
            .catch(err => console.log(err))
    }, [props.id])

    return (
        <>
            {totalLikesCount === 0 ? <p><i className="far fa-heart"></i> : No Like</p> : <p><i className="far fa-heart"></i> : {totalLikesCount}</p>}
        </>
    )
}