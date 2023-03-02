import { useState } from "react";
import { auth } from "../FirebaseDb/Firebase";
import { signInWithEmailAndPassword} from "firebase/auth";
import "./Login.css";

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
		<div className="account-form">
			<div className="account-form-container">
				<h2>Fitness Friends</h2>
				<h1>Log In</h1>
				<form className="login-form" onSubmit={signIn}>
					<label>Username</label>
					<input type="username" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)}/>
					
					<label>Password</label>
					<input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
					<div className="account-form-options">
						<label className="checkbox-label">
							<input type="Checkbox"/> Remember me
						</label>
						<a>Forget password?</a>
					</div>
					<button type="submit">Log In</button>
				</form>
			</div>
		</div>
	)
}