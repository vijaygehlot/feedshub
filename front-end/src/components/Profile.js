import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Modal, ModalBody } from 'reactstrap';
import axios from 'axios';
import { GetUserName } from './GetUserDetail';
import { GetTotalComments, GetTotalLikes } from './GetComments'
import classnames from 'classnames';

const Profile = ({ history }) => {
    const [activeTab, setActiveTab] = useState('1');
    const [modal, setModal] = useState(false);

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const userDetails = useSelector(state => {
        if (state.userExist !== false) {
            return state.Name[0].message.userDetail
        }
    })

    const userId = useSelector(state => {
        if (state.userExist !== false) {
            return state.Name[0].message.userDetail._id
        }
    })

    const userBlogs = useSelector(state => {
        if (state.userExist !== false) {
            return state.Name[0].message.userBlogs
        }
    })

    const handleDelete = (id) => {
        axios.delete(`/blogs/delete/${id}`)
            .then(res => console.log(res))
            .catch(err => console.log(err))
        window.location.reload()
    }

    const toggleModal = () => setModal(!modal);

    const deleteModalPopUp = () => {
        return (
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalBody>
                    <span onClick={toggleModal}><i className="fas fa-times"></i></span>
                    Are you sure you want to delete account and all Blogs, Comments and Likes from this account ?<br />
                    <Button className="btn btn-danger mr-3" onClick={() => deleteAccount()}>Yes</Button>
                    <Button className="btn btn-theme" onClick={toggleModal}>No</Button>
                </ModalBody>
            </Modal>
        )
    }

    const deleteAccount = () => {
        axios.delete(`blogs/users/delete/${userId}`)
            .then(res => {
                console.log(res.data)
                localStorage.removeItem('Token')
                window.location.href = '/'
            })
            .catch(err => console.log(err))

        axios.delete(`/blogs/deleteUserBlogs/${userId}`)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))

        axios.delete(`/blogs/comments/deleteUserComments/${userId}`)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))

        axios.delete(`/blogs/likes/deleteUserLikes/${userId}`)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }

    const dateFormat = dateStr => {
        const date = new Date(dateStr)
        const currentMonth = date.getMonth() + 1;
        const monthString = currentMonth >= 10 ? currentMonth : `0${currentMonth}`;
        const currentDate = date.getDate();
        const dateString = currentDate >= 10 ? currentDate : `0${currentDate}`;
        return `${dateString}-${monthString}-${date.getFullYear()}`;
    }

    console.log(userBlogs)

    return (
        <div className="container-theme row mt-default">
            {deleteModalPopUp()}
            <div className="col-sm-3 left-display-container">
                <div className="display-pic-container">
                    <img src={`${userDetails && userDetails.profileImage}`} width="200" alt="profile-pic" />
                </div>
                <p className="display-name">{userDetails && userDetails.name}</p>
            </div>
            <div className="col-sm-9">
                <Nav tabs className="profile-tab">
                    <NavItem>
                        <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => { toggle('1'); }}>Profile</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => { toggle('2'); }}>Blogs</NavLink>
                    </NavItem>
                </Nav>
            
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1" className="profile-tab-pane tab-pane theme-bottom-footer">
                    <h1 className="tab-head-text">Profile Detail</h1>
                    <p><span>Name :</span> {userDetails && userDetails.name}</p>
                    <p><span>Email :</span> {userDetails && userDetails.email}</p>
                    <p><span>Phone Number :</span> {userDetails && userDetails.phoneNumber}</p>
                    <p><span>Country :</span> {userDetails && userDetails.country}</p>
                    <Link to={`/edit-profile${userDetails && userDetails._id}`} className="btn btn-success mr-3 mb-6">Edit Profile</Link>
                    <Button className="btn btn-danger" onClick={toggleModal}>Delete Account</Button>
                </TabPane>
                <TabPane tabId="2" className="tab-pane">
                    <h1 className="tab-head-text">Blogs posted</h1>
                    {userBlogs === "Sorry! no blogs" ? <div className="no-blogs-page theme-bottom-footer">No Blogs written yet.</div> : userBlogs && userBlogs.map((blog) => {
                        return (
                            <div className="blog-container" key={blog._id}>
                                <div className="blog-img">
                                    <img alt="blog-banner-img" src={`${blog.bannerImage}`} />
                                </div>
                                <div className="blog-body">
                                    <h1 className="blog-title">{blog.title}</h1>
                                    <div className="blog-detail">
                                        <p><i className="fas fa-calendar-week"></i> : {dateFormat(blog.date)}</p>
                                        <GetTotalComments id={blog._id} />
                                        <GetTotalLikes id={blog._id} />
                                        <p><span className="blog-category-block">{blog.category === undefined ? 'Others' : blog.category}</span></p>
                                    </div>
                                    <GetUserName id={blog.userId} />
                                    <hr className="my-2" />
                                    <p>{blog.description}</p>
                                    <Link className="btn btn-theme mr-3" color="primary" to={`/read-blog${blog._id}`}>Read Blog</Link>
                                    <Link to={`/edit-blog${blog._id}`} className="btn btn-success mr-3">Edit Blog</Link>
                                    <Button color="danger" onClick={() => handleDelete(blog._id)}>Delete</Button>
                                </div>
                            </div>
                        )
                    })}
                </TabPane>
            </TabContent>
            </div>
        </div>
    )
}

export default Profile