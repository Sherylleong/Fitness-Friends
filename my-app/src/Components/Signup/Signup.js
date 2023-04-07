import React, { useState } from "react";
import "../Login/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { UserController} from "../../Controller/UserController";

export default function SignUp() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showMissingUsername, setMissingUsername] = useState(false);
	const [showInvalidUsername, setInvalidUsername] = useState(false);
	const [showMissingPassword, setMissingPassword] = useState(false);
	const [showPasswordRequirement, setPasswordRequirement] = useState(false);
	const [showEmailUsed, setEmailUsed] = useState(false);
	const navigate = useNavigate();


	const resetStates = () => {
		setMissingUsername(false);
		setInvalidUsername(false);
		setMissingPassword(false);
		setPasswordRequirement(false);
		setEmailUsed(false);
	}

	const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
	function checkSpecialLetter(input) { 
		var split = input.split("");
		var rtn = false;
		split.forEach((char) => {
			if (specialChars.includes(char)) {
				rtn = true;
			}
		});
		return rtn;
	}
	
	const createAcc = async (e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		resetStates();
		if (password.length >= 8) {
			if (checkSpecialLetter(password)) {
				const uc = new UserController(username, password);
				await uc.createAcc().then(function(code) {
					switch (code) {
						case "Success":
							navigate("/Login");
							break;
						case "auth/email-already-in-use":
							setEmailUsed(true);	
							console.log("hhi");
							break;
						case "auth/missing-email":
							setMissingUsername(true)
							break;
						case "auth/invalid-email":
							if (!username) {
								setMissingUsername(true);
							}else {
								setInvalidUsername(true);
							}
							break;
						case "auth/weak-password":
							setPasswordRequirement(true);
							break;
						case "auth/internal-error":
							if (password == null || password == "") {
								setMissingPassword(true);
							}
							break;
						default:
							break;
					}
				});
				return
			}
		}
		setPasswordRequirement(true);
		return;
	}

	return (
		<div className="account-form">
			<div className="account-form-container">
				<h2>Fitness Friends</h2>
				<h1>Sign Up</h1>
				<form className="login-form" onSubmit={createAcc}>
					<label>Email</label>
					<input type="username" placeholder="Enter your email" onChange={(e) => setUsername(e.target.value)}/>
					<label>Password</label>
					<input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
					<div style={{display: showMissingUsername ? 'block' : 'none'}} className="account-form-incorrect">Email field is required.</div>
					<div style={{display: showInvalidUsername ? 'block' : 'none'}} className="account-form-incorrect">Email is invalid.</div>
					<div style={{display: showMissingPassword ? 'block' : 'none'}} className="account-form-incorrect">Password field is required.</div>
					<div style={{display: showPasswordRequirement ? 'block' : 'none'}} className="account-form-incorrect">Password has to be at least 8 characters and contain a special letter.</div>
					<div style={{display: showEmailUsed ? 'block' : 'none'}} className="account-form-incorrect">Email already in use.</div>
					<button type="submit">Sign Up</button>
					<Link style={{"text-align":"left"}} to="/">Return to home</Link>
				</form>
			</div>
		</div>
	)
}