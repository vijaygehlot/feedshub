import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import './css/main.css';
import AppNavBar from './components/AppNavBar'
import Home from './components/Home'
import Blogs from './components/Blogs'
import Signup from './components/Signup'
import Login from './components/Login'
import AddBlog from './components/AddBlog'
import ReadBlog from './components/ReadBlog'
import Profile from './components/Profile'
import EditBlog from './components/EditBlog'
import EditProfile from './components/EditProfile'
import UserProfile from './components/UserProfile'
import SearchResult from './components/SearchResult'
import NoResult from './components/NoResult';

const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const token = localStorage.getItem('Token')
		if (token == null) {
			console.log("token", token);
			return
		} else if (token === "undefined") {
             return;
           } else {
             let base64Url = token.split(".")[1];
             console.log("base64Url", base64Url);

             let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
             let jsonPayload = decodeURIComponent(
               atob(base64)
                 .split("")
                 .map(function(c) {
                   return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                 })
                 .join("")
             );

             const decodedToken = JSON.parse(jsonPayload);

             const config = {
               headers: {
                 "x-auth-header": token
               }
             };
             axios
               .get(`/blogs/users/${decodedToken.userId}`, config)
               .then(res => {
                 const userName = res.data;
                 if (res.data.message.userDetail !== null) {
                   dispatch({ type: "USER_DETAIL", payload: userName });
                 }
               })
               .catch(err => console.log(err));
           }
	})

	const userName = useSelector(state => {
		if (state.userExist !== false && state.Name[0].message.userDetail !== null) {
			return state.Name[0].message.userDetail.name
		}
	})

	const userExist = useSelector(state => {
		if (state.userExist !== false) {
			return state.userExist
		}
	})

	return (
		<BrowserRouter>
			<div className="App">
				<AppNavBar userName={userName} userExist={userExist} />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/blogs" component={Blogs} />
					<Route exact path="/signup" component={Signup} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/add-blog" component={AddBlog} />
					<Route exact path="/read-blog:id" component={ReadBlog} />
					<Route exact path="/profile" component={Profile} />
					<Route exact path="/edit-blog:id" component={EditBlog} />
					<Route exact path="/edit-profile:id" component={EditProfile} />
					<Route exact path="/user-profile:id" component={UserProfile} />
					<Route exact path="/search:keyword" component={SearchResult} />
					<Route path="*" component={NoResult} />
				</Switch>
				<div className="footer mt-default">
			   &#169;2020 Feeds Hub. All Rights Reserved</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
