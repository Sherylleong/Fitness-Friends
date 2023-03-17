import "./EditProfile.css";
import { useState } from "react";

export default function EditProfile() {
	const [displayName, setDisplayName] = useState("");
	return (
		<div className="editprofile">
			<div className ="header">
				<h1>Edit Profile</h1>
				<p><b>This information displayed on your profile.</b></p>
			</div>
			<div className="body">
				<div className="left-div">
					<div>
						<img className="editprofile-img" src="https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c" />
						<button>Change Image</button>
						<button>Remove Image</button>
					</div>
					<div className="form-items">
						<form>
							<b>Name (Required)</b>
							<input lassName="default-input" type="text"></input>
							<b>Your Location</b>
							<input type="text"></input>
							<b>Bio</b>
							<input className="bio-input" type="text"></input>
						</form>
					</div>
				</div>
				<div className="profile-settings">
					<div className="profile-toggle-settings">
						<div>
							<b>Show groups Joined</b>
							<p>The setting will toggle the view of <br/>your groups joined on your profile. </p>
						</div>
						<label class="switch">
							<input type="checkbox"/>
							<span class="slider round"></span>
						</label>
					</div>
					<div className="profile-toggle-settings">
						<div>
							<b>Show groups Joined</b>
							<p>The setting will toggle the view of <br/>your groups joined on your profile. </p>
						</div>
						<label class="switch">
							<input type="checkbox"/>
							<span class="slider round"></span>
						</label>
					</div>
					<div className="profile-toggle-settings">
						<div>
							<b>Show groups Joined</b>
							<p>The setting will toggle the view of <br/>your groups joined on your profile. </p>
						</div>
						<label class="switch">
							<input type="checkbox"/>
							<span class="slider round"></span>
						</label>
					</div>
					<div className="form-items">
						<form>
							<b>Name (Required)</b>
							<input lassName="default-input" type="text"></input>
							<b>Your Location</b>
							<input type="text"></input>
							<b>Bio</b>
							<input className="bio-input" type="text"></input>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}