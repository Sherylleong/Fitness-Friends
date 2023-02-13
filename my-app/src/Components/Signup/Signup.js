import React, { useState } from "react";
import {auth} from "../FirebaseDb/Firebase";
import { createUserWithEmailAndPassword} from "firebase/auth"

export default function signUp() {
	const [email, setEmail] = useState(0);
	const [password, setPassword] = useState(0);

	const createAcc = (e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		createUserWithEmailAndPassword(auth, email, password).then((reply) => {
			console.log(reply);
		}).catch((error) => {
			console.log(error);
		});
	}
	return (
		<form>
			<h1>Sign Up</h1>
			<input type="username" placeholder="Enter your username" value={email} onChange={(e) => setEmail(e.target.value)}/>
			<input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
			<button type="submit">Sign Up</button>
		</form>
	)
}