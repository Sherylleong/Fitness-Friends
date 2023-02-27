import "./nav-styles.css";

export default function Navbar() {
	return (
		<nav className="nav">
			<img className="site-icon" href="/" src={require("../../images/site-icon.png")}></img>
			<ul>
				<li>
					<a href="/Home">Home</a>
				</li>
				<li>
					<a href="/CRUD">CRUD</a>
				</li>
				<li>
					<a href="/Events">Events</a>
				</li>
				<li>
					<a href="/Groups">Groups</a>
				</li>
				<li>
					<a href="/Login">Log In</a>
				</li>
				<li>
					<a href="/Signup">Sign up</a>
				</li>


			</ul>
		</nav>
	)
}