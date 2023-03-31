import { useState, useEffect, useRef, createContext, useContext } from "react";

import { signInWithEmailAndPassword} from "firebase/auth";
import "./Login.css";
import { dispatch } from "../../App"
import { Link, redirect, useNavigate } from "react-router-dom";
import { firestore, auth } from "../FirebaseDb/Firebase";
import { collection, query, where, onSnapshot, updateDoc,doc } from 'firebase/firestore';


export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showMissingUsername, setMissingUsername] = useState(false);
	const [showMissingPassword, setMissingPassword] = useState(false);
	const [showIncorrectLogin, setIncorrectLogin] = useState(false);
	var currUid = "";
	const navigate = useNavigate();

	const signIn = async(e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		setIncorrectLogin(false);
		if (verifyLoginData()) {
			signInWithEmailAndPassword(auth, username, password).then((reply) => {
				if (reply.operationType == "signIn") {
					dispatch({newId: reply.user.uid});
					currUid = reply.user.uid;
					getProfile();
				}
			}).catch((error) => {
				if (error.code == "auth/wrong-password" || error.code == "auth/invalid-email" || error.code == "auth/user-not-found") {
					setIncorrectLogin(true);
				}else if (error.code == "auth/user-not-found") {
					//If needed to seperate
				}
				else console.log(error);
			});
		}
	}

	const getProfile = () => {
		const queryDb = query(collection(firestore, 'users'), where("userId", "==", currUid));
		onSnapshot(queryDb, (querySnapshot) => {
			querySnapshot.forEach((result) => {
				if (result.data().displayName == null) {
					navigate("/EditProfile");
				}else {
					navigate("/ViewProfile")
				}
			});
			});
	};

	const verifyLoginData = (e) => {
		setMissingPassword(false);
		setMissingUsername(false);

		if (username == null || username == "") {
			setMissingUsername(true);
			return false;
		}else if(password == null || password == "") {
			setMissingPassword(true);
			return false;
		}


		return true;
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
					<div style={{display: showMissingUsername ? 'block' : 'none'}} id="missing-username" className="account-form-incorrect">Username field is required.</div>
					<div style={{display: showMissingPassword ? 'block' : 'none'}} id="missing-password" className="account-form-incorrect">Password field is required.</div>
					<div style={{display: showIncorrectLogin ? 'block' : 'none'}} id="incorrect-login" className="account-form-incorrect">Incorrect Username or Password.</div>
					<div className="account-form-options">
						{/* <label className="checkbox-label">
							<input type="Checkbox"/> Remember me
						</label> */}
						<Link to="/ForgetPassword">Forget password?</Link>
					</div>
					<button type="submit">Log In</button>
					<Link style={{"text-align":"left"}} to="/">Return to home</Link>
				</form>
			</div>
		</div>
	);
}