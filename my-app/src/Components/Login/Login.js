import { useState } from "react";

import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.css";
import { UserController } from "../../Controller/UserController";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showMissingUsername, setMissingUsername] = useState(false);
	const [showMissingPassword, setMissingPassword] = useState(false);
	const [showIncorrectLogin, setIncorrectLogin] = useState(false);
	const navigate = useNavigate();

	const signIn = async(e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		setIncorrectLogin(false);
		if (verifyLoginData()) {
			const uc = new UserController(username, password);
			uc.login().then(function(code) {
				switch (code) {
					case "Success":
						navigate("/ViewProfile");
						break;
					case "auth/wrong-password":
					case "auth/invalid-email":
					case "auth/user-not-found":
						setIncorrectLogin(true);
						break;
					default:
						break;
				}
			});
		}
	}

	const verifyLoginData = (e) => {
		setMissingPassword(false);
		setMissingUsername(false);

		if (username == null || username == "") {
			setMissingUsername(true);
			return false;
		}else if(password == null || password == "") {
			setMissingPassword(true);
			return false;
		}
		return true;
	}

	return (
		<div className="account-form">
			<div className="account-form-container">
				<h2>Fitness Friends</h2>
				<h1>Log In</h1>
				<form className="login-form" onSubmit={signIn}>
					<label>Email</label>
					<input type="username" placeholder="Enter your Email" onChange={(e) => setUsername(e.target.value)}/>
					
					<label>Password</label>
					<input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
					<div style={{display: showMissingUsername ? 'block' : 'none'}} id="missing-username" className="account-form-incorrect">Email field is required.</div>
					<div style={{display: showMissingPassword ? 'block' : 'none'}} id="missing-password" className="account-form-incorrect">Password field is required.</div>
					<div style={{display: showIncorrectLogin ? 'block' : 'none'}} id="incorrect-login" className="account-form-incorrect">Incorrect Email or Password.</div>
					<div className="account-form-options">
						<Link to="/ForgetPassword">Forget password?</Link>
					</div>
					<button type="submit">Log In</button>
					<Link style={{"text-align":"left"}} to="/">Return to home</Link>
				</form>
			</div>
		</div>
	);
}