import ProfileData from "./ProfileData";
import { useState, useEffect } from "react";
import "./ViewProfile.css";
function ViewProfile() {
  return (
    <>
      <div clasName="full-screen112">
        {ProfileData.map((profile) => (
          <div className="full112">
            <div className="left112">
              <div className="left-top112">
                <div className="left-top-left112">
                  <div className="image-container112">
                    <div clasName="profile-img112">
                      <img
                        className="profile-picture112"
                        src={profile.profilepic}
                      ></img>
                    </div>
                  </div>

                  <div className="edit-profile-button112">
                    <button className="edit-profile112" type="submit">
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="left-top-right112">
                  <div className="profilename112">{profile.name}</div>
                  <div className="joined112">Joined {profile.joined}</div>
                  <div className="locationtext112">{profile.location}</div>
                  <div className="attended112">
                    Attended {profile.attended} events
                  </div>
                  <div className="biotext112">Bio</div>
                  <div className="bio112">{profile.bio}</div>
                </div>
              </div>

              <div className="left-bottom112">
                <div className="events-box112">
                  <div className="events-selector112">
                    <div className="events-selector-left112">
                      <button
                        className="events-selector-attending112"
                        type="submit"
                      >
                        Events Attending
                      </button>
                    </div>
                    <div className="events-selector-righ112t">
                      <button
                        className="events-selector-owned112"
                        type="submit"
                      >
                        Events Owned
                      </button>
                    </div>
                  </div>
                  <div className="events-list112">
                    {profile.eventsattending.map((event) => (
                      <div className="event112" key={event.eventid}>
                        <div className="event-left112">
                          <div className="event-left-left112">
                            <div className="event-image-container112">
                              <img
                                className="event-image112"
                                src={event.eventimage}
                              ></img>
                            </div>
                          </div>
                          <div className="event-left-right112">
                            <div className="event-title112">
                              {event.eventtitle}
                            </div>
                            <div className="event-location112">
                              Location: {event.eventlocation}
                            </div>
                            <div className="event-date112">
                              {event.eventdate}
                            </div>
                          </div>
                        </div>
                        <div className="event-right112">
                          <div className="tags-container112">
                            {event.eventtags.map((tag, index) => (
                              <div key={index} className="tag112">
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
            <div className="right112">
              <div className="right-top112"></div>
              <div className="right-bottom112"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
export default ViewProfile;
