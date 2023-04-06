import { useState, useEffect, useRef, createContext, useContext, useStoreState } from "react";

import { signInWithEmailAndPassword} from "firebase/auth";
import "./Login.css";
import { dispatch } from "../../App"
import { Link, redirect, useNavigate } from "react-router-dom";
import { firestore, auth, storage } from "../FirebaseDb/Firebase";
import { collection, addDoc, query, where, onSnapshot, updateDoc,doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword} from "firebase/auth"
import "../Login/Login.css";
import { sendPasswordResetEmail } from "firebase/auth"
import { updatePassword } from "firebase/auth"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserController } from "../../Controller/UserController";
import Filter from 'bad-words';

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showMissingUsername, setMissingUsername] = useState(false);
	const [showMissingPassword, setMissingPassword] = useState(false);
	const [showIncorrectLogin, setIncorrectLogin] = useState(false);
	const navigate = useNavigate();

	const signIn = async(e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		setIncorrectLogin(false);
		if (verifyLoginData()) {
			const uc = new UserController(username, password);
			uc.login().then(function(code) {
				switch (code) {
					case "Success":
						navigate("/ViewProfile");
						break;
					case "auth/wrong-password":
					case "auth/invalid-email":
					case "auth/user-not-found":
						setIncorrectLogin(true);
						break;
				}
			});
		}
	}

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
					<label>Email</label>
					<input type="username" placeholder="Enter your Email" onChange={(e) => setUsername(e.target.value)}/>
					
					<label>Password</label>
					<input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
					<div style={{display: showMissingUsername ? 'block' : 'none'}} id="missing-username" className="account-form-incorrect">Email field is required.</div>
					<div style={{display: showMissingPassword ? 'block' : 'none'}} id="missing-password" className="account-form-incorrect">Password field is required.</div>
					<div style={{display: showIncorrectLogin ? 'block' : 'none'}} id="incorrect-login" className="account-form-incorrect">Incorrect Email or Password.</div>
					<div className="account-form-options">
						<Link to="/ForgetPassword">Forget password?</Link>
					</div>
					<button type="submit">Log In</button>
					<Link style={{"text-align":"left"}} to="/">Return to home</Link>
				</form>
			</div>
		</div>
	);
}

function ProfileController(){
	const navigate = useNavigate();
	const [showMissingEmail, setMissingEmail] = useState(false);
	const [showInvalidEmail, setInvalidEmail] = useState(false);
	const [showEmailSent, setEmailSent] = useState(false);
	const [noEmailFound, setNoEmailFound] = useState(false);
	const [documentId, setDocumentId] = useState("");
	const userId = useStoreState("userId");
	const [profilePic, setProfilePic] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [noName, setNoName] = useState(false);
	const [location, setLocation] = useState("");
	const [bio, setBio] = useState("");
	const [groupJoined, setGroupJoined] = useState(false);
	const [eventAttending, setEventAttending] = useState(false);
	const [eventAttended, setEventAttended] = useState(false);
	
	const [newPassword, setNewPassword] = useState("");
	const [showChangePasswordError, setShowChangePasswordError] = useState(false);
	const [showPasswordLengthError, setPasswordLengthError] = useState(false);
	const [showNameError, setShowNameError] = useState(false);
	const [testFile, setTest] = useState(null);

	const returnToProfilePage = () => {
		navigate("/ViewProfile");
	}
	const uploadFile = async() => {
		if (testFile != null) { 
			var imageUrl = profilePic;
			if (testFile != true) {
			const imageRef = ref(storage, userId+"-profilepic");
			await uploadBytes(imageRef, testFile);

			const imageURL = await getDownloadURL(imageRef);
			setProfilePic(imageURL);
				imageUrl = imageURL;
			}
			const updateQuery = doc(firestore, 'users', documentId);
			updateDoc(updateQuery, {
				profilePic: imageUrl
			}).then(() => {
				updateDetails();
			});
		}else {
			updateDetails();
		}
	}

	const updateDetails = async() => {
		const updateQuery = doc(firestore, 'users', documentId);
		const badFilter = new Filter();
		let displayNameChange=displayName, bioChange=bio;
		try {displayNameChange = badFilter.clean(displayName)} catch(e) {}
		try {bioChange = badFilter.clean(bio)} catch(e) {}

		
		updateDoc(updateQuery, {
			displayName: displayNameChange,
			Location: location,
			Bio: bioChange,
			settings: {
				groupJoined: groupJoined,
				eventAttending: eventAttending,
				eventAttended: eventAttended
			}
		}).then(()=> {
			console.log("Update Success");
			returnToProfilePage();
		}).catch((error) => {
			console.log(error);
			
		});;
	}
}

function UserAccountController(){
	const [showIncorrectLogin, setIncorrectLogin] = useState(false);
	const [showMissingEmail, setMissingEmail] = useState(false);
	const [showInvalidEmail, setInvalidEmail] = useState(false);
	const [showEmailSent, setEmailSent] = useState(false);
	const [noEmailFound, setNoEmailFound] = useState(false);
	const [documentId, setDocumentId] = useState("");

	const [profilePic, setProfilePic] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [noName, setNoName] = useState(false);
	const [location, setLocation] = useState("");
	const [bio, setBio] = useState("");
	const [groupJoined, setGroupJoined] = useState(false);
	const [eventAttending, setEventAttending] = useState(false);
	const [eventAttended, setEventAttended] = useState(false);
	
	const [newPassword, setNewPassword] = useState("");
	const [showChangePasswordError, setShowChangePasswordError] = useState(false);
	const [showPasswordLengthError, setPasswordLengthError] = useState(false);
	const [showNameError, setShowNameError] = useState(false);
	const userId = useStoreState("userId");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showMissingUsername, setMissingUsername] = useState(false);
	const [showInvalidUsername, setInvalidUsername] = useState(false);
	const [showMissingPassword, setMissingPassword] = useState(false);
	const [showPasswordRequirement, setPasswordRequirement] = useState(false);
	const [showEmailUsed, setEmailUsed] = useState(false);
	var currUid = "";

	const navigate = useNavigate();

	const resetStates = () => {
		setMissingUsername(false);
		setInvalidUsername(false);
		setMissingPassword(false);
		setPasswordRequirement(false);
		setEmailUsed(false);
	}
	const signIn = async(e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		setIncorrectLogin(false);
		if (verifyLoginData()) {
			signInWithEmailAndPassword(auth, username, password).then((reply) => {
				if (reply.operationType == "signIn") {
					dispatch({newId: reply.user.uid});
					currUid = reply.user.uid;
					navigate("/ViewProfile");
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



	const createAcc = (e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		resetStates();
		if (password.length >= 8) {
			if (checkSpecialLetter(password)) {
				createUserWithEmailAndPassword(auth, username, password).then((reply) => {
					// Display Popup to tell user successful
					alert("Account created successfully");
					const today = new Date();
					const formattedDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

					var displayName = username.split("@")[0];
					addDoc(collection(firestore, 'users'), {
						userId: reply.user.uid,
						profilePic: "https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c",
						displayName: displayName,
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
				return;
			}
		}
		setPasswordRequirement(true);
		return;
	}


	const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
	function checkSpecialLetter(input) { 
		var split = input.split("");
		var rtn = false;
		split.forEach((char) => {
			console.log(char);
			console.log(specialChars.includes(char));
			if (specialChars.includes(char)) {
				rtn = true;
			}
		});
		return rtn;
	}

	const resetPassword = async (e) => {
		e.preventDefault(); //Prevent Reload on Form Submit
		setInvalidEmail(false);
		setEmailSent(false);
		setMissingEmail(false);
		setNoEmailFound(false);

		// await 
		await sendPasswordResetEmail(auth, username).then((reply) => {
			console.log(reply);
			setEmailSent(true);
		}).catch((error) => {
			console.log(error);
			if (error.code == "auth/invalid-email") {
				setInvalidEmail(true);
			}else if(error.code == "auth/missing-email") {
				setMissingEmail(true);
			}
			else if (error.code == "auth/user-not-found"){
				setNoEmailFound(true);
			}
		});
		// console.log("Reset Password Email Sent");
	}


	function changePassword() {
		if (newPassword != "") {
			setShowChangePasswordError(false);
			setPasswordLengthError(false);
			if (newPassword.length >= 8) {
				if (checkSpecialLetter(newPassword)) {
			updatePassword(auth.currentUser, newPassword).then(()=> {
				alert("Password update Success");
				// uploadFile();
			}).catch((error) => {
				console.log(error);
			});
			return;
				}
			}
			setPasswordLengthError(true); 
			return;
		}else {
			//Display new password empty
			setShowChangePasswordError(true);
		}
	}
	



}