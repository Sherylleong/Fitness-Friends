import React, { useState } from "react";
import { createUserWithEmailAndPassword} from "firebase/auth"
import "../Login/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { dispatch } from "../../App"
import { addDoc, collection} from "firebase/firestore";
import { firestore, auth } from "../FirebaseDb/Firebase";

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

	const createAcc = (e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		resetStates();
		createUserWithEmailAndPassword(auth, username, password).then((reply) => {
			// Display Popup to tell user successful
			// console.log(reply);
			dispatch({newId: reply.user.uid});
			alert("Account created successfully");
			const today = new Date();
			const formattedDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

            addDoc(collection(firestore, 'users'), {
                userId: reply.user.uid,
                profilePic: "https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c",
				displayName: null,
				JoinedDate: formattedDate,
				Location: null,
				Bio: null,
				settings: {
					groupJoined: true,
					eventAttending: true,
					eventAttended: true
				}
            });
            navigate("/Login"); //Navigate to login to do login demo
		}).catch((error) => {
			let code = error.code;

			switch (code) {
				
				case "auth/email-already-in-use":
					setEmailUsed(true);	
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
					<div style={{display: showMissingUsername ? 'block' : 'none'}} className="account-form-incorrect">Email field is required.</div>
					<div style={{display: showInvalidUsername ? 'block' : 'none'}} className="account-form-incorrect">Email is invalid.</div>
					<div style={{display: showMissingPassword ? 'block' : 'none'}} className="account-form-incorrect">Password field is required.</div>
					<div style={{display: showPasswordRequirement ? 'block' : 'none'}} className="account-form-incorrect">Password has to be at least 6 characters.</div>
					<div style={{display: showEmailUsed ? 'block' : 'none'}} className="account-form-incorrect">Email already in use.</div>
					<button type="submit">Sign Up</button>
					<Link style={{"text-align":"left"}} to="/Home">Return to home</Link>
				</form>
			</div>
		</div>
	)
}