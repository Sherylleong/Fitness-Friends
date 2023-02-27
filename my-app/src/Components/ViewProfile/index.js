import ProfileData from "./ProfileData";
import { useState, useEffect } from "react";
import './ViewProfile.css';
function ViewProfile() {
  return (
  <>
    <div classname="full-screen">
      {ProfileData.map((profile) => (
        <div classname="full">
          <div classname="left">
              <div classname="left-top">
                <div classname="left-top-left">

                  <div classname="image-container">
                    <img classname="profile-picture" src={profile.profilepic}></img>
                  </div>

                  <div classname="edit-profile-button">
                    <button classname="edit-profile" type="submit">
                      Edit Profile
                    </button>
                  </div>

                </div>

                <div classname="left-top-right">

                  <div classname="name">{profile.name}</div>
                  <div classname="joined">Joined {profile.joined}</div>
                  <div classname="location">{profile.location}</div>
                  <div classname="attended">Attended {profile.attended} events</div>
                  <div classname="biotext">Bio</div>
                  <div classname="bio">{profile.bio}</div>
                  
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  </>
  );
}
export default ViewProfile;