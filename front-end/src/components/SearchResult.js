import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { GetUserName } from './GetUserDetail';
import { GetTotalComments, GetTotalLikes } from './GetComments'

const SearchResult = props => {
    const [blogs, setBlogs] = useState(null)
    const keyword = props.match.params.keyword

    const fetchResult = (keyword) => {
        console.log('props - ', keyword)
        axios.get(`/blogs/search/${keyword}`)
            .then(res => {
                setBlogs(res.data)
            })
            .catch(err => console.log(err.response))  
    }

    const memoisedFetch = useMemo(() => fetchResult(keyword), [keyword])

    const dateFormat = dateStr => {
        const date = new Date(dateStr)
        const currentMonth = date.getMonth() + 1;
        const monthString = currentMonth >= 10 ? currentMonth : `0${currentMonth}`;
        const currentDate = date.getDate();
        const dateString = currentDate >= 10 ? currentDate : `0${currentDate}`;
        return `${dateString}-${monthString}-${date.getFullYear()}`;
    }

    return (
        <div className="container mt-default">
            <h2 className="search-result-head">Search result for, "{keyword}"</h2>
            {memoisedFetch}
            {blogs && blogs.length ? 
            blogs.map((blog) => {
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
                            <p className="blog-short-descp">{blog.description}</p>
                            <Link className="btn btn-theme" color="primary" to={`/read-blog${blog._id}`}>Read Blog</Link>
                        </div>
                    </div>
                )
                }) : (
                    <div className="not-authorized-page theme-bottom-footer">
                        Sorry, no result found for "{keyword}"
                    </div>
                )}
        </div>
    )
}

export default SearchResult