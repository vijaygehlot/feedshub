import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalBody } from 'reactstrap'
import { Link } from 'react-router-dom';
import { GetCommentBy } from './GetComments'
import { useSelector } from 'react-redux'
import AppSpinner from './AppSpinner'
import axios from 'axios'
import qs from 'query-string';

const ReadBlogComments = ({ id }) => {
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState('')
    const [tokenExist, setTokenExist] = useState(false)
    const [isPageLoading, setIsPageLoading] = useState(false)
    const [commentAdded, setCommentAdded] = useState(false)
    const [modal, setModal] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('Token')
        if (token !== null) {
            setTokenExist(true)
        }

        setCommentError('')
        setCommentAdded(false)
    }, [commentAdded])

    const userId = useSelector(state => {
        if (state.userExist !== false) {
            return state.Name[0].message.userDetail._id
        }
    }, [])

    const handleSubmit = e => {
        e.preventDefault()
        if(!tokenExist) {
            toggle()
        } else if (!comment.length) {
            setCommentError('Comment cannot be blank')
        } else {
            setIsPageLoading(true)
            const commentDetail = {
                comment,
                userId
            }
            axios.post(`blogs/comments/add/${id}`, qs.stringify(commentDetail))
                .then(res => {
                    setComment('')
                    setCommentAdded(true)
                    setIsPageLoading(false)
                })
                .catch(err => console.log('error - ',err)) 
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
        <>
            {isPageLoading ? <AppSpinner /> : 
                <>
                    {ModalPopUp()}
                    <div className="blog-add-comment">
                        <input type="text" placeholder="Write Comment" className="form-control" name="comment" value={comment} onChange={event => setComment(event.target.value)} />
                        {commentError !== '' && <span className="input-error">{commentError}</span>}
                        <Button className="btn btn-info btn-comment" onClick={handleSubmit}><i className="far fa-paper-plane"></i></Button>
                    </div>
                    <div>
                        <GetCommentBy id={id} />
                    </div>
                </>
            }
        </>
    )
}

export default ReadBlogComments