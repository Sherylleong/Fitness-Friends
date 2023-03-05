import "./nav-styles.css";
import { Link, RouterProvider, redirect, useNavigate } from 'react-router-dom'
import { useContext } from "react";
import { dispatch, useStoreState} from "../../App"


export default function Navbar() {
	let showLogin = true;
	const userId = useStoreState("userId");

	if (userId != "") {
		showLogin = false;
	}

	const signedOutStyle = {
		display: showLogin ? "block" : "none"
	}

	const loggedInStyle = {
		display: showLogin ? "none" : "block"
	}

	const logOut = (e) => {
		dispatch({newId: ""});
	}

	return (
		<nav className="nav">
			<img className="site-icon" src={require("../../images/site-icon.png")}></img>
			<ul>
				<li>
					<Link to="/Home">Home</Link>
				</li>
				<li>
					<Link to="/CRUD">CRUD</Link>
				</li>
				<li>
					<Link to="/Events">Events</Link>
				</li>
				<li>
					<Link to="/Groups">Groups</Link>
				</li>
				<li style={signedOutStyle}>
					<Link to="/Login">Log In</Link>
				</li>
				<li style={signedOutStyle}>
					<Link to="/Signup">Sign up</Link>
				</li>
				<li style={loggedInStyle}>
					<Link to="/Home" onClick={logOut}>Logout</Link>
				</li>
			</ul>
		</nav>
	)
}