import React, { useState, useEffect } from 'react'
import HomeCarousel from './HomeCarousel'
import axios from 'axios'

const Home = () => {
    const [totalBlogs, setTotalBlogs] = useState(0)

    useEffect(() => {
        const token = localStorage.getItem('Token')
        let config = {
            headers: {
                'x-auth-header': token,
            }
        }

        axios.get(`/blogs`, config)
            .then(res => {
                setTotalBlogs(res.data.totalBlogs)
            })
            .catch(err => console.log(err))
    }, [])
    return (
        <div>
            <HomeCarousel />
            {/* <div className="total-blogs">
                <div className="total-number">{totalBlogs}</div>
                <div className="total-descp">Blogs to <br />read from, <br />and counting..</div>
            </div> */}
            <div className="container-theme row mt-default">
                <div className="col-sm-4">
                    <div className="about-box">
                        <div className="hover-overlay"></div>
                        <div className="about-body">
                            <img src={require('../images/blog-read.png')} alt="blog-read-img" />
                            <h2>Read Blogs</h2>
                            <p>Read blogs written by various users on #Feeds Hub</p>
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="about-box">
                        <div className="hover-overlay"></div>
                        <div className="about-body">
                            <img src={require('../images/blog-write.png')} alt="blog-write-img" />
                            <h2>Write Blogs</h2>
                            <p>Write your own blog to share it with other people</p>
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="about-box">
                        <div className="hover-overlay"></div>
                        <div className="about-body">
                            <img src={require('../images/blog-explore.png')} alt="blog-explore-img" />
                            <h2>Explore Blogs</h2>
                            <p>Explore from variety ranges of blogs of your interest</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home