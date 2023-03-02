import ProfileData from "./ProfileData";
import { useState, useEffect } from "react";
import "./ViewProfile.css";
function ViewProfile() {
  return (
  <>
    <div clasName="full-screen">
      {ProfileData.map((profile) => (
        <div className="full">
          <div className="left">
              <div className="left-top">
                <div className="left-top-left">

                <div className="image-container">
                  <div clasName="profile-img">
                    <img className="profile-picture" src={profile.profilepic}></img>
                  </div>
                </div>

                  <div className="edit-profile-button">
                    <button className="edit-profile" type="submit">
                      Edit Profile
                    </button>
                  </div>

                </div>

                <div className="left-top-right">

                  <div className="profilename">{profile.name}</div>
                  <div className="joined">Joined {profile.joined}</div>
                  <div className="locationtext">{profile.location}</div>
                  <div className="attended">Attended {profile.attended} events</div>
                  <div className="biotext">Bio</div>
                  <div className="bio">{profile.bio}</div>
                  
                </div>
            </div>

            <div className="left-bottom">
              <div className="events-box">
                <div className="events-selector">
                  <div className="events-selector-left">
                    <button className="events-selector-attending" type="submit">
                      Events Attending
                    </button>
                  </div>
                  <div className="events-selector-right">
                  <button className="events-selector-owned" type="submit">
                      Events Owned
                    </button>
                  </div>
                </div>
                <div className="events-list">
                  {profile.eventsattending.map((event) => (
                    <div className="event" key={event.eventid}>
                      <div className="event-left">
                        <div className="event-left-left">
                          <div className="event-image-container">
                            <img className="event-image" src={event.eventimage}></img>
                          </div>
                        </div>
                        <div className="event-left-right">
                          <div className="event-title">{event.eventtitle}</div>
                          <div className="event-location">Location: {event.eventlocation}</div>
                          <div className="event-date">{event.eventdate}</div>
                        </div>
                      </div>
                      <div className="event-right">
                        <div className="tags-container">
                        {event.eventtags.map((tag, index) => (
                          <div key={index} className="tag">
                            {tag}
                          </div>
                        ))}  
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
          <div className="right">
            <div className="right-top">
            </div>
            <div className="right-bottom">
            </div>
          </div>
        </div>))}
    </div>
  </>
  );
}
export default ViewProfile;