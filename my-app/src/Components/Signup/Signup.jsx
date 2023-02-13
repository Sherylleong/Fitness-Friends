import {auth} from "../FirebaseDb/Firebase";
import { useState} from "react";
import { createUserWithEmailAndPassword} from "firebase/auth"

const signUp = () => {
	const [username, setUsername] = useState((e) => {
		username = e;
	});
	const [password, setPassword] = useState();

	const createAcc = (e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		createUserWithEmailAndPassword(auth, username, password).then((reply) => {
			console.log(reply);
		}).catch((error) => {
			console.log(error);
		});
	}
	return (
		<form>
			<h1>Sign Up</h1>
			<input type="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)}/>
			<input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
			<button type="submit">Sign Up</button>
		</form>
	)
}

export default signUp