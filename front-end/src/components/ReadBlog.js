import React, { useEffect, useState } from 'react'
import { GetLikes } from './GetComments'
import { GetUSerInfo } from './GetUserDetail'
import { stateToHTML } from 'draft-js-export-html'; 
import { convertFromRaw } from 'draft-js';
import axios from 'axios'
import AppSpinner from './AppSpinner'
import ReadBlogComments from './ReadBlogComments'

const ReadBlog = props => {
    const [blog, setBlog] = useState(null)
    const [isPageLoading, setIsPageLoading] = useState(false)
    const id = props.match.params.id

    useEffect(() => {
        axios.get(`blogs/${id}`)
            .then(res => {
                setBlog(res.data)
                setIsPageLoading(false)
            })
            .catch(err => console.log(err))

        setIsPageLoading(true)
    }, [id])

    const dateFormat = dateStr => {
        const date = new Date(dateStr)
        const currentMonth = date.getMonth() + 1;
        const monthString = currentMonth >= 10 ? currentMonth : `0${currentMonth}`;
        const currentDate = date.getDate();
        const dateString = currentDate >= 10 ? currentDate : `0${currentDate}`;
        return `${dateString}-${monthString}-${date.getFullYear()}`;
    }

    const convertDataFromJSONToHTML = (text) => {  
        let html = stateToHTML(convertFromRaw(JSON.parse(text))) 
        return html
    }

    return (
        <div className="container-theme mt-default blog-read-container">
            {isPageLoading ? <AppSpinner /> : (<div>
                {blog && <h1 className="blog-title">{blog.title}</h1>}
                <img className="w-100" src={blog && blog.bannerImage} alt="blog-banner-img" />
                {blog && <h2 className="blog-short-description">{blog.description}</h2>}
                {blog && <div className="blog-body" dangerouslySetInnerHTML={{__html: convertDataFromJSONToHTML(blog.body)}} />}
                <p className="blog-publish-date">Published on : {dateFormat(blog && blog.date)} | <span className="blog-category-block">{blog && blog.category}</span></p> 
                <div className="d-flex justify-content-center">
                    <GetUSerInfo id={blog && blog.userId} />
                </div>
                <GetLikes id={id}  blog={blog} blogId={blog && blog._id} />
                <ReadBlogComments id={id} />
            </div>)}
        </div>
    )
}

export default ReadBlog