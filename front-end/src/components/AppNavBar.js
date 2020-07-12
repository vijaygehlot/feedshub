import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavbarText } from 'reactstrap';
import { useSelector } from "react-redux";
import SearchBlog from './SearchBlog'

const AppNavBar = ({ userExist, userName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
    const [isCloseSideMenu, setIsCloseSideMenu] = useState(false)

    const handleLogOut = () => {
        localStorage.removeItem('Token')
        window.location.reload()
    }

    const toggle = () => setIsOpen(!isOpen);

    const sideMenuClick = () => {
        setIsSideMenuOpen(true)
    }

    const closeSideMenu = () => {
        setIsSideMenuOpen(false)
        setIsCloseSideMenu(true)
    }

    const windowSideMenuClose = () => {
        setIsSideMenuOpen(false)
        setIsCloseSideMenu(true)
    }

    const userDetail = useSelector(state => {
        if (state.userExist !== false) {
            return state.Name[0].message.userDetail
        }
    })

    return (
        <div>
            <Navbar className="sticky-top" expand="md">
                <NavbarBrand href="/" style={{fontFamily:'fantasy'}}>
                    Feeds <span className="hub-back" style={{ borderRadius: '5px', backgroundColor:'#4ecca3',color:'black',padding:'1%'}}>Hub</span>
				</NavbarBrand>
                <span className="navbar-toggler" onClick={toggle}><i className="fas fa-bars"></i></span>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto align-items-center" navbar>
                        <NavItem>
                            <SearchBlog />
                        </NavItem>
                        <NavItem>
                            <NavLink exact to="/" activeClassName="active">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink exact to="/blogs" activeClassName="active">Blogs</NavLink>
                        </NavItem>
                        {/* <NavItem>
                            <NavLink to="/signup" activeClassName="active">Sign Up</NavLink>
                        </NavItem> */}
                        <NavItem>
                            { userExist ?null :  <NavLink to="/signup" activeClassName="active">Sign Up</NavLink>}
                        </NavItem>
                        {userExist || <NavItem>
                            <NavLink to="/login" activeClassName="active">Login</NavLink>
                        </NavItem>}
                        {/* <NavItem>
                            { userExist ?null :  <NavLink to="/login" activeClassName="active">Login</NavLink>}
                        </NavItem> */}
                        <NavItem>
                            <NavLink to="/add-blog" activeClassName="active">Write Blog</NavLink>
                        </NavItem>
                        <NavItem>
                            {userExist && <NavbarText onClick={sideMenuClick} className="profile-link">Profile</NavbarText>}
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
            <div className={isSideMenuOpen ? "overlay-bg-show" : "side-menu-close"} onClick={windowSideMenuClose}>
                <div className={isSideMenuOpen ? "side-menu side-menu-open" : isCloseSideMenu ? "side-menu side-menu-close" : "side-menu"}>
                    <div className="side-menu-body">
                        <div onClick={closeSideMenu} className="close-icon"><i className="fas fa-times"></i></div>
                        <div className="profile-img-container">
                            <img src={userDetail && userDetail.profileImage} className="w-100 h-100" alt="profile-img" />
                        </div>
                        <p className="mt-4">Welcome, <span className="text-theme-secondary">{userName}</span></p>
                        <div className="side-menu-nav">
                            <NavLink to="/profile" activeClassName="active">My Profile</NavLink>
                            <NavLink to={`/edit-profile${userDetail && userDetail._id}`}>Edit Profile</NavLink>
                            {userExist && <NavLink to="/" onClick={handleLogOut} activeClassName="active">Logout</NavLink>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppNavBar;
