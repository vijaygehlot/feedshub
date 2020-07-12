import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

export const GetUserName = ({ id }) => {
    const [userName, setUserName] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('Token')
        let config = {
            headers: {
              'x-auth-header': token,
            }
        }
        axios.get(`/blogs/users/${id}`, config)
            .then(res => {
                setUserName(res.data.message.userDetail.name)
            })
            .catch(err => console.log(err.response))
    }, [id])

    return (
        <p className="blog-author"><i className="fas fa-user"></i> : <Link color="primary" to={`/user-profile${id}`}>{userName && userName}</Link></p>
    )
}

export const GetUSerInfo = ({ id }) => {
    const [userDetail, setUserDetail] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('Token')
        let config = {
            headers: {
              'x-auth-header': token,
            }
        }
        if(id !== null) {
            axios.get(`/blogs/users/${id}`, config)
                .then(res => {
                    setUserDetail(res.data.message.userDetail)
                })
                .catch(err => console.log(err.response))
        }
    }, [id])

    return (
        <div className="blog-user-detail">
            <div className="blog-user-img">
                <img src={userDetail.profileImage} alt="user-profile-pic" />
            </div>
            <div className="blog-user-descp">
                <Link color="primary" to={`/user-profile${id}`}>{userDetail.name}</Link>
                <p>{userDetail.email}</p>
            </div>
        </div>
    )
}