import React, { useState } from "react";
import { auth } from "../FirebaseDb/Firebase";
import { createUserWithEmailAndPassword} from "firebase/auth"

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
		<form onSubmit={createAcc}>
			<h1>Sign Up</h1>
			<input type="username" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)}/>
			<input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
			<button type="submit">Sign Up</button>
		</form>
	)
}