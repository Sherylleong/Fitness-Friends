import { useState } from "react";
import { auth } from "../FirebaseDb/Firebase";
import { sendPasswordResetEmail } from "firebase/auth"
import "../Login/Login.css";
import { Link } from "react-router-dom";

export default function ForgetPassword() {
	const [username, setUsername] = useState("");
	const [showMissingEmail, setMissingEmail] = useState(false);
	const [showInvalidEmail, setInvalidEmail] = useState(false);
	const [showEmailSent, setEmailSent] = useState(false);


	const resetPassword = async (e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		setInvalidEmail(false);
		setEmailSent(false);
		setMissingEmail(false);

		// await 
		await sendPasswordResetEmail(auth, username).then((reply) => {
			console.log(reply);
			setEmailSent(true);
		}).catch((error) => {
			console.log(error);
			if (error.code == "auth/invalid-email") {
				setInvalidEmail(true);
			}else if(error.code == "auth/missing-email") {
				setMissingEmail(true);
			}
		});
		// console.log("Reset Password Email Sent");
	}
	return (
		<div className="account-form">
		<div className="account-form-container">
			<h2>Fitness Friends</h2>
			<h1>Forget Password</h1>
			<form className="login-form" onSubmit={resetPassword}>
				<label>Email</label>
				<input type="username" placeholder="Enter your email" onChange={(e) => setUsername(e.target.value)}/>
				<div style={{display: showMissingEmail ? 'block' : 'none'}} className="account-form-incorrect">Email field is required.</div>
				<div style={{display: showInvalidEmail ? 'block' : 'none'}} className="account-form-incorrect">Invalid email.</div>
				<div style={{display: showEmailSent ? 'block' : 'none'}}  className="account-form-correct">Password reset email sent.</div>
				<button type="submit">Submit Email</button>
				<Link style={{"text-align":"left"}} to="/Login"> Return to login </Link>
			</form>
		</div>
		</div>
);
}