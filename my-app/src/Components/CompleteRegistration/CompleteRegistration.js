import { useState, useRef, createContext, useContext } from "react";
import { auth } from "../FirebaseDb/Firebase";
import { signInWithEmailAndPassword} from "firebase/auth";
import "../Login/Login.css";
import { dispatch, useStoreState} from "../../App"
import { Link, redirect, useNavigate } from "react-router-dom";
import { firestore } from "../FirebaseDb/Firebase";
import { addDoc} from "firebase/firestore";
import { collection } from 'firebase/firestore';

export default function CompleteRegistration() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showMissingUsername, setMissingUsername] = useState(false);
    const userId = useStoreState("userId");

	const navigate = useNavigate();

	const signIn = (e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		if (verifyLoginData()) {
            console.log("Adding");
			const today = new Date();
			const formattedDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

            addDoc(collection(firestore, 'users'), {
                userId: userId,
                profilePic: null,
				displayName: username,
				JoinedDate: formattedDate,
				Location: null,
				Bio: null
            });
            navigate("/Login"); //Navigate to login to do login demo
		}
	}

	const verifyLoginData = (e) => {
		setMissingUsername(false);

		if (username == null || username == "") {
			setMissingUsername(true);
			return false;
		}

		return true;
	}

	return (
		<div className="account-form">
			<div className="account-form-container">
				<h2>Fitness Friends</h2>
				<h1>Complete Registration</h1>
				<form className="login-form" onSubmit={signIn}>
					<label>Display Name</label>
					<input type="username" placeholder="Enter your name" onChange={(e) => setUsername(e.target.value)}/>
					
					<label>Password</label>
					<input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
					<div style={{display: showMissingUsername ? 'block' : 'none'}} id="missing-username" className="account-form-incorrect">Username field is required.</div>
					<div className="account-form-options">
						<label className="checkbox-label">
							<input type="Checkbox"/> Remember me
						</label>
						<Link to="/ForgetPassword">Forget password?</Link>
					</div>
					<button type="submit">Log In</button>
					<Link style={{"text-align":"left"}} to="/Home">Return to home</Link>
				</form>
			</div>
		</div>
	);
}