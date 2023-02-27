import ProfileData from './ProfileData';
import { useState, useEffect } from 'react';
import './ViewProfile.css';
function ViewProfile() {
  return (
    <>
    <div classname="full-screen">
      <div classname="full">
        <div classname="left">
          <div classname="left-top">
            <div classname="left-top-left">

              <div classname="image-container">
                <img classname="profile-picture" src={ProfileData[0].profilepic}></img>
              </div>

              <div classname="edit-profile-button">
                <button classname="edit-profile" type="submit">
                  Edit Profile
                </button>
              </div>

            </div>

            <div classname="left-top-right">

              <div classname="name">{ProfileData[0].name}</div>
              <div classname="joined">Joined {ProfileData[0].joined}</div>
              <div classname="location">{ProfileData[0].location}</div>
              <div classname="attended">Attended {ProfileData[0].attended} events</div>
              <div classname="biotext">Bio</div>
              <div classname="bio">{ProfileData[0].bio}</div>
              
            </div>
          </div>
        </div>
      </div>
      </div>
      </>
  );
}

export default ViewProfile;