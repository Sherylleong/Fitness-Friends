import "./EditProfile.css";
import { useState, useEffect } from "react";
import { useStoreState } from "../../App"
import { firestore, storage, auth } from "../FirebaseDb/Firebase";
import {collection,doc, updateDoc ,getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updatePassword } from "firebase/auth"
import { useNavigate } from "react-router-dom";



export default function EditProfile() {
	const userId = useStoreState("userId");
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
	const navigate = useNavigate();

	/*
	for (i=0; i <= 24;i++) {
    	arr.push(document.querySelector("#mw-content-text > div.mw-parser-output > table:nth-child(24) > tbody").childNodes[24+i].childNodes[1].childNodes[0].text);
	}
	*/
	// Taken from wikipedia
	const sgTowns =['','Ang Mo Kio', 'Bedok', 'Bishan', 'Bukit Batok', 'Bukit Merah', 'Bukit Panjang', 'Choa Chu Kang', 'Clementi', 'Geylang', 'Hougang', 'Jurong East', 'Jurong West', 'Kallang', 'Pasir Ris', 'Punggol', 'Queenstown', 'Sembawang', 'Sengkang', 'Serangoon', 'Tampines', 'Tengah', 'Toa Payoh', 'Woodlands', 'Yishun'];
	const townOptions = () => {
		const options = sgTowns.map((town, index)=><option value={town}>{town}</option>)

		// return <select>{options}</select>
		return <h1>hi</h1>
	}


	function flipValue(id) {
		switch(id) {
			case 0:
				setGroupJoined(!groupJoined);
				break;
			case 1:
				setEventAttending(!eventAttending);
				break;
			case 2:
				setEventAttended(!eventAttended);
				break;
			default:
				break;
		}
	}

	
	const getProfile = async () => {
		const docRef = query(collection(firestore, "users"), where("userId", "==", userId));
		const docu = await getDocs(docRef);
		docu.forEach((doc) => {
			setDocumentId(doc.id);
			var userData = doc.data();
			setProfilePic(userData.profilePic);
			setBio(userData.Bio);
			setDisplayName(userData.displayName);
			setLocation(userData.Location);
			var settings = userData.settings;
			setGroupJoined(settings.groupJoined == true);
			setEventAttending(settings.eventAttending == true);
			setEventAttended(settings.eventAttended == true);
		});

		if (displayName == null || displayName == "") {
			setNoName(true);
		}
	};

	const saveProfile = () => {
		if (newPassword != "") {
			// Handle Password Change First
			changePassword();
		}else {
			if (!displayName) {
				setShowNameError(true);
			}
			else {
				setShowNameError(false);
				alert("Profile details changed!")
				uploadFile();
			}
			
		}
	}

	function changePassword() {
		if (newPassword != "") {
			setShowChangePasswordError(false);
			setPasswordLengthError(false);
			if (newPassword.length<6) {
				setPasswordLengthError(true); return;
			}
			updatePassword(auth.currentUser, newPassword).then(()=> {
				alert("Password update Success");
				uploadFile();
			}).catch((error) => {
				console.log(error);
			});
		}else {
			//Display new password empty
			setShowChangePasswordError(true);
		}
	}

	const [testFile, setTest] = useState(null);
	const acceptFile = event => {
		var fileUploaded = event.target.files[0];
		setTest(fileUploaded);
		setProfilePic(URL.createObjectURL(fileUploaded));
		// uploadFile(fileUploaded);
	};



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
		updateDoc(updateQuery, {
			displayName: displayName,
			Location: location,
			Bio: bio,
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

	const removeImage = () => {
		setTest(true);
		setProfilePic("https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c");
		// const updateQuery = doc(firestore, 'users', documentId);
		// updateDoc(updateQuery, {
		// 	profilePic: profilePic
		// });
	}

	const returnToProfilePage = () => {
		navigate("/ViewProfile");
	}

	useEffect(() => {
		getProfile();
	  }, []);

	return (
		<div className="editprofile">
			<div className ="header">
				<h1>Edit Profile</h1>
				<p><b>This information will be displayed on your profile.</b></p>
			</div>
			<div className="body">
				<div className="left-div">
					<div className="button-align-center">
						<img className="editprofile-img" src={profilePic}/>
						<label className="button-upload-file">Change Image
							<input type="file" accept="image/png, image/jpeg" onChange={acceptFile}></input>
						</label>
						<button className="dull-button" onClick={()=>removeImage()}>Remove Image</button>
					</div>
					<div className="form-items">
						<form>
							<b>Name (Required)</b>
							<input lassName="default-input" type="text" value={displayName} onChange={(e)=>setDisplayName(e.target.value)}></input>
							<div style={{display: showNameError ? 'block' : 'none'}} id="missing-name" className="account-form-incorrect">Display name is required.</div>
							<b>Your Location</b>
							<select value={location} onChange={(e)=>setLocation(e.target.value)}>
								{sgTowns.map(towns=> <option value={towns}>{towns}</option>)}
							</select>
							<b>Bio</b>
							<textarea className="bio-input" value={bio} onChange={(e)=>setBio(e.target.value)}></textarea>
						</form>
					</div>
				</div>
				<div className="profile-settings">
					<div className="profile-toggle-settings">
						<div className="toggle-settings-details">
							<b>Show groups Joined</b>
							<p>The setting will toggle display of your participating groups on your profile. </p>
						</div>
						<label class="switch">
							<input type="checkbox" checked={groupJoined} onClick={()=>flipValue(0)}/>
							<span class="slider round"></span>
						</label>
					</div>
					<div className="profile-toggle-settings">
						<div className="toggle-settings-details">
							<b>Show Events Attending</b>
							<p>This setting will toggle the display of  events  you are attending on your profile. </p>
						</div>
						<label class="switch">
							<input type="checkbox" checked={eventAttending} onClick={()=>flipValue(1)}/>
							<span class="slider round"></span>
						</label>
					</div>
					<div className="profile-toggle-settings">
						<div className="toggle-settings-details">
							<b>Show Events Attended</b>
							<p>This setting will toggle the view of events you have attended.</p>
						</div>
						<label class="switch">
							<input type="checkbox" checked={eventAttended} onClick={()=>flipValue(2)}/>
							<span class="slider round"></span>
						</label>
					</div>
					<div className="form-items">
						<h1>Change password</h1>
						<form>
							<b>Enter new password</b>
							<input type="password" onChange={(e)=>setNewPassword(e.target.value)}></input>
							<div style={{display: showChangePasswordError ? 'block' : 'none'}} id="missing-pwd" className="account-form-incorrect">Non-empty password is required.</div>
							<div style={{display: showPasswordLengthError ? 'block' : 'none'}} id="missing-pwd" className="account-form-incorrect">Password must be at least 6 characters.</div>
						</form>
					</div>
					<div className="button-align-from-left">
						<button onClick={()=>saveProfile()}>Save Changes</button>
						<button className="dull-button" onClick={()=>returnToProfilePage()}>Discard Changes</button>
					</div>
				</div>
			</div>
		</div>
	);
}