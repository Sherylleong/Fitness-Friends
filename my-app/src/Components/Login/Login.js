import { useState } from "react";
import { auth } from "../FirebaseDb/Firebase";
import { signInWithEmailAndPassword} from "firebase/auth"

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const signIn = (e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		console.log(auth)
		signInWithEmailAndPassword(auth, username, password).then((reply) => {
			console.log(reply);
		});
	}
	return (
		<form onSubmit={signIn}>
			<h1>Log In</h1>
			<input type="username" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)}/>
			<input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
			<button type="submit">Log In</button>
		</form>
	)
}