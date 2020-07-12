import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, PaginationItem, PaginationLink, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import { GetUserName } from './GetUserDetail';
import { GetTotalComments, GetTotalLikes } from './GetComments'
import AppSpinner from './AppSpinner';

const Blogs = () => {
    const [blogs, setBlogs] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5)
    const [filterCategory, setFilterCategory] = useState('all')
    const [totalBlogs, setTotalBlogs] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    let totalPages = Math.ceil(totalBlogs / limit)
    let endPage = false
    let isPrevDisabled = false
    let isNextDisabled = false

    useEffect(() => {
        const token = localStorage.getItem('Token')
        let config = {
            headers: {
                'x-auth-header': token,
            }
        }
        if (filterCategory === 'all') {
            axios.get(`/blogs?page=${page}&limit=${limit}`, config)
                .then(res => {
                    setBlogs(res.data.results)
                    setTotalBlogs(res.data.totalBlogs)
                    setIsLoading(false)
                })
                .catch(err => console.log(err))
        } else {
            axios.post(`/blogs/filterCategory/${filterCategory}?page=${page}&limit=${limit}`)
                .then(res => {
                    setBlogs(res.data.results)
                    setTotalBlogs(res.data.totalBlogs)
                    setIsLoading(false)
                })
                .catch(err => console.log(err))
        }
        setIsLoading(true)
    }, [page, limit, filterCategory]);

    if (blogs.length < limit) {
        endPage = true
    }

    if (page === 1) {
        isPrevDisabled = true
        isNextDisabled = false
    } else if (page === totalPages) {
        isPrevDisabled = false
        isNextDisabled = true
    } else {
        isPrevDisabled = false
    }

    const nextPage = () => {
        if (endPage === false) {
            setPage(page + 1)
        }
    }

    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    const goToPage = (pageNumber) => {
        setPage(pageNumber)
    }

    const firstPage = () => {
        setPage(1)
    }

    const lastPage = () => {
        setPage(Math.ceil(totalBlogs / limit))
    }

    const dateFormat = dateStr => {
        const date = new Date(dateStr)
        const currentMonth = date.getMonth() + 1;
        const monthString = currentMonth >= 10 ? currentMonth : `0${currentMonth}`;
        const currentDate = date.getDate();
        const dateString = currentDate >= 10 ? currentDate : `0${currentDate}`;
        return `${dateString}-${monthString}-${date.getFullYear()}`;
    }

    const showBlogs = () => {
        if (blogs.length) {
            return blogs && blogs.map((blog) => {
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
                            <p className="blog-short-descp">{blog.description}</p>
                            <Link className="btn btn-theme" color="primary" to={`/read-blog${blog._id}`}>Read Blog</Link>
                        </div>
                    </div>
                )
            })
        } else {
            return (
                <div className="not-authorized-page theme-bottom-footer">
                    No Blogs found for {filterCategory} category
                </div>
            )
        }
    }

    const showPagination = () => {
        let pageArr = []
        for (let i = 1; i <= totalPages; i++) {
            pageArr.push(i)
        }

        return (
            <Pagination aria-label="Blogs Pagination" className="blogs-pagination">
                <PaginationItem onClick={() => firstPage()} disabled={isPrevDisabled ? true : false}>
                    <PaginationLink first />
                </PaginationItem>
                <PaginationItem onClick={() => prevPage()} disabled={isPrevDisabled ? true : false}>
                    <PaginationLink previous />
                </PaginationItem>
                {pageArr.map(pageNumber => (
                    <PaginationItem active={pageNumber === page ? true : false} key={pageNumber} onClick={() => goToPage(pageNumber)}>
                        <PaginationLink>
                            {pageNumber}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem onClick={() => nextPage()} disabled={isNextDisabled ? true : false}>
                    <PaginationLink next />
                </PaginationItem>
                <PaginationItem onClick={() => lastPage()} disabled={isNextDisabled ? true : false}>
                    <PaginationLink last />
                </PaginationItem>
            </Pagination>
        )
    }

    return (
        <div className="container-theme mt-default">
            <div className="row">
                <div className="col-sm-3">
                    <Form className="app-form">
                        <FormGroup>
                            <Label htmlFor="limit">Blogs per page</Label>
                            <Input type="select" name="limit" id="exampleSelect" onChange={e => setLimit(e.target.value)}>
                                <option value='5'>5</option>
                                <option value='10'>10</option>
                                <option value='15'>15</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="category">Category</Label>
                            <Input type="select" name="category" onChange={e => setFilterCategory(e.target.value)}>
                                <option value="all">Show All</option>
                                <option>Organization</option>
                                <option>Business</option>
                                <option>Information Technology</option>
                                <option>Covid-19</option>
                                <option>India</option>
                                <option>Media</option>
                                <option>Sports</option>
                                <option>Others</option>
                            </Input>
                        </FormGroup>
                    </Form>
                </div>
                <div className="col-sm-9">
                    {isLoading ?
                        <AppSpinner /> :
                        <>
                            {showBlogs()}
                            {blogs.length && showPagination()}
                        </>}
                </div>
            </div>
        </div>
    )
}

export default Blogs