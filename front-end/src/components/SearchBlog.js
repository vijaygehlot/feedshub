import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Fade } from 'reactstrap'

const SearchBlog = () => {
    const [seacrhText, setSearchText] = useState('')
    const [fadeIn, setFadeIn] = useState(false)

    const toggle = () => setFadeIn(!fadeIn)

    return (
        <div>
            <span onClick={toggle} className="search-nav-item"><i className="fas fa-search"></i></span>
            <Fade in={fadeIn} tag="div" className="search-box-container">
            <div className="search-input">
                <input type="text" className="form-control" onChange={e => setSearchText(e.target.value)} placeholder="Search..." />
                <Link to={`/search${seacrhText}`} className="search-btn"><i className="fas fa-search"></i></Link>
            </div>
            </Fade>
        </div>
    )
}

export default SearchBlog