import React, { useState } from "react";
import { auth } from "../FirebaseDb/Firebase";
import { createUserWithEmailAndPassword} from "firebase/auth"
import "../Login/Login.css";

export default function SignUp() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const createAcc = (e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		createUserWithEmailAndPassword(auth, username, password).then((reply) => {
			console.log(reply);
		}).catch((error) => {
			console.log(error);
		});
	}
	return (
		<div className="account-form">
			<div className="account-form-container">
				<h2>Fitness Friends</h2>
				<h1>Sign Up</h1>
				<form className="login-form" onSubmit={createAcc}>
					<label>Username</label>
					<input type="username" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)}/>
					
					<label>Password</label>
					<input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
					<button type="submit">Sign Up</button>
				</form>
			</div>
		</div>
	)
}