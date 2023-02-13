import { useState } from "react";
import {auth} from "../FirebaseDb/Firebase";
import { signInWithEmailAndPassword} from "firebase/auth"

export default function login() {
	const [username, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const signIn = (e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		signInWithEmailAndPassword(auth, username, password).then((reply) => {
			console.log(reply);
		});
	}
	return (
		<form>
			<h1>Log In</h1>
			<input type="username" placeholder="Enter your username" value={username} onChange={(e) => setEmail(e.target.value)}/>
			<input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
			<button type="submit">Log In</button>
		</form>
	)
}