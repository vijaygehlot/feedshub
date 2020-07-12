import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { GetTotalComments, GetTotalLikes } from './GetComments'
import { GetUserName } from './GetUserDetail';
import classnames from 'classnames';
import axios from 'axios';

const Profile = props => {
    const [userDetails, setUserDetails] = useState(null)
    const [userBlogs, setUserBlogs] = useState(null)
    const [activeTab, setActiveTab] = useState('1');
    const id = props.match.params.id

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }
    
    useEffect(() => {
        const token = localStorage.getItem('Token')
        const config = {
            headers: {
                'x-auth-header': token,
            }
        }

        axios.get(`blogs/users/${id}`, config)
            .then((res) => {
                setUserDetails(res.data.message.userDetail)
                setUserBlogs(res.data.message.userBlogs)
            })
            .catch(err => console.log(err.response))
    }, [id])

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
                </TabPane>
                <TabPane tabId="2" className="tab-pane">
                    <h1 className="tab-head-text">Blogs posted</h1>
                    {userBlogs === "Sorry! no blogs" ? <div className="no-blogs-page">No Blogs written yet.</div> : userBlogs && userBlogs.map((blog) => {
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
                                        <p>{blog.category === undefined ? 'Others' : blog.category}</p>
                                    </div>
                                    <GetUserName id={blog.userId} />
                                    <hr className="my-2" />
                                    <p>{blog.description}</p>
                                    <Link className="btn btn-theme mr-3" color="primary" to={`/read-blog${blog._id}`}>Read Blog</Link>
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