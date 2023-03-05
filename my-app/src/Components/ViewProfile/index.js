import ProfileData from "./ProfileData";
import { useState, useEffect } from "react";
import "./ViewProfile.css";
import ReactPaginate from "react-paginate";
function ViewProfile() {
  // set up attending and owned events
  const [attending, setAttending] = useState(true);
  const [owned, setOwned] = useState(false);
  const attendinghandler = () => {
    setAttending(true);
    setOwned(false);
  };
  const ownedhandler = () => {
    setAttending(false);
    setOwned(true);
  };

  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };
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
                        onClick={attendinghandler}
                      >
                        Events Attending
                      </button>
                    </div>
                    <div className="events-selector-righ112t">
                      <button
                        className="events-selector-owned112"
                        type="submit"
                        onClick={ownedhandler}
                      >
                        Events Owned
                      </button>
                    </div>
                  </div>
                  {owned && (
                      <div className="manage-events112">
                        <button className="manage-events-button112" type="submit">
                          Manage Events
                        </button>
                      </div>
                  )}
                  <div className="events-list112">
                    {attending && profile.eventsattending.slice(currentPage*3,currentPage*3+3).map((event) => (
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
                    {owned && profile.eventsowned.slice(currentPage*3,currentPage*3+3).map((event) => (
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
                  <div className="event-pagination112">
                  {profile.eventsattending.length > 3 ||
                    profile.eventsowned.length > 3 ? (
                      <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        pageCount={Math.ceil((attending ? profile.eventsattending.length : profile.eventsowned.length) / 3)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={(selectedPage) => handlePageChange(selectedPage.selected)}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="right112">
              <div className="right-top112"></div>
              <div className="groupsjoined112">
                <div classname="groupsjoinedtext112">Groups Joined</div>
                <div className="groupsjoinedlist112">
                  {profile.groupsjoined.map((group) => (
                    <div className="group-bo112" key={group.groupid}>
                      <div className="grouptitle112">{group.title}</div>
                      <div className="groupmembers112">{group.attendees} members</div>
                      <div className="group-creator112">Created by {group.creator}</div>
                    </div>
                  ))}
                  </div>
              </div>
              <div className="right-bottom112"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
export default ViewProfile;
