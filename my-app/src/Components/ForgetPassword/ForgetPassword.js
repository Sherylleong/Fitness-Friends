import { useState } from "react";
import { auth } from "../FirebaseDb/Firebase";
import { sendPasswordResetEmail } from "firebase/auth"

export default function ForgetPassword() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const resetPassword = async (e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		await sendPasswordResetEmail(auth, username);
		console.log("Reset Password Email Sent");
	}
	return (
		<form onSubmit={resetPassword}>
			<h1>Log In</h1>
			<input type="username" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)}/>
			<button type="submit">Log In</button>
		</form>
	)
}