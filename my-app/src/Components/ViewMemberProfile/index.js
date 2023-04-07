import { useState, useEffect } from "react";
import "../ViewProfile/ViewProfile.css";
import ReactPaginate from "react-paginate";
import { firestore } from "../FirebaseDb/Firebase";
import 'firebase/firestore';
import { async } from "@firebase/util";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {collection,doc,documentId,getDocs, query, where } from "firebase/firestore";
import { UserController } from "../../Controller/UserController";


function ViewMemberProfile() {
  // set up attending and owned events
  const { memberId: urlMemberId } = useParams(); // retrieve the EventId from the URL parameter
  const userId = urlMemberId;
  const [attending, setAttending] = useState(false);
  const [owned, setOwned] = useState(false);
  const [attended, setAttended] = useState(true);
  const [currentEventPage, setcurrentEventPage] = useState(0); 
  const [currentJoinedPage, setCurrentJoinedPage] = useState(0);
  const [currentOwnedPage, setCurrentOwnedPage] = useState(0);
  const [numEvents112, setNumEvents112] = useState(0);
  const [groupsOwned112, setGroupsOwned112] = useState([]);
  const [eventsJoined112, setEventsJoined112] = useState([]);
  const [eventsOwned112, setEventsOwned112] = useState([]);
  const [eventsJoinedPast, setEventsJoinedPast] = useState([]);
  const [eventsOwnedPast, setEventsOwnedPast] = useState([]);
  const [profile2, setProfile2] = useState("");
  const [groupsJoined112, setGroupsJoined112] = useState([]);
  const [settingAttending, setSettingAttending] = useState(false);
  const [settingAttended, setSettingAttended] = useState(false);
  const [settingGroups, setSettingGroups] = useState(false);
  const uc = new UserController();
  
  const attendinghandler = () => {
    setAttending(true);
    setOwned(false);
    setAttended(false);
    setcurrentEventPage(0);
  };
  const ownedhandler = () => {
    setAttending(false);
    setOwned(true);
    setAttended(false);
    setcurrentEventPage(0);
  };
  const attendedhandler = () => {
    setAttending(false);
    setOwned(false);
    setAttended(true);
    setcurrentEventPage(0);
  }

  const navigate = useNavigate();

  const handleEventPageChange = (selectedEventPage) => {
    setcurrentEventPage(selectedEventPage);
  };
  const handleJoinedPageChange = (selectedJoinedPage) => {
    setCurrentJoinedPage(selectedJoinedPage);
  };

  const handleOwnedPageChange = (selectedOwnedPage) => {
    setCurrentOwnedPage(selectedOwnedPage);
  };

  const handleViewMemberReturn = () => {
    navigate(-1);
  };
  

  const initProfile =  async () => {
    uc.viewProfileDetails(userId, setProfile2, setSettingAttending, setSettingAttended, setSettingGroups, setAttending, setAttended);
    uc.getUserJoinedGroups(userId, setGroupsJoined112);
    uc.getUserCreatedGroups(userId, setGroupsOwned112);
    uc.getUserJoinedEvents(userId, setEventsJoined112, setEventsJoinedPast);
    uc.getUserCreatedEvents(userId, setEventsOwned112, setEventsOwnedPast);
    uc.getNumEvents(userId,setNumEvents112);
  }

  useEffect(() => {
    initProfile();
  }, []);

  const ViewEventHandler = (eventId) => {
    console.log(eventId);
    navigate(`/ViewEvent/` + eventId);
  };

  const ViewGroupHandler = (groupId) => {
    navigate(`/ViewGroup/` + groupId);
  };

  return (
    <>
      <div clasName="full-screen112">
      <button className="ViewMembersBackButton" onClick={handleViewMemberReturn}>&lt; Back</button>
          <div className="full112">
          <div className="left112">
              <div className="left-top112">
                <div className="left-top-left112">
                  <div className="image-container112">
                    <div clasName="profile-img112">
                      <img
                        className="profile-picture112"
                        src={profile2.profilePic}
                      ></img>
                    </div>
                  </div>
                  <div className="edit-profile-button112">
                  </div>
                </div>
                <div className="left-top-right112">
                  <div className="profilename112">{profile2.displayName}</div>
                  <div className="joined112">Joined: {profile2.JoinedDate}</div>
                  <div className="locationtext112">Location: {profile2.Location}</div>
                  <div className="attended112">
                    Attended {numEvents112} events
                  </div>
                  <div className="biotext112">Bio</div>
                  <div className="bio112">{profile2.Bio}</div>
                </div>
              </div>
              <div className="left-bottom112">
                  <div className="events-box112">
                {settingAttending || settingAttended ? <>
                <div className="events-selector112">
                  {settingAttending ? <>
                  <div className="events-selector-left112">
                    <button
                      className={
                        attending ? "events-selected" : "events-unselected"
                      }
                      type="submit"
                      onClick={attendinghandler}
                    >
                      Events Attending
                    </button>
                  </div>
                  <div className="events-selector-righ112t">
                    <button
                      className={
                        owned ? "events-selected" : "events-unselected"
                      }
                      type="submit"
                      onClick={ownedhandler}
                    >
                      Events Owned
                    </button>
                  </div>
                  </> : <></>}
                  {settingAttended ? <>
                  <div className="events-selector-righ112t">
                      <button
                        className={
                          attended ? "events-selected" : "events-unselected"
                        }
                        type="submit"
                        onClick={attendedhandler}>
                        Events Attended
                      </button>
                    </div>
                    </>: <></>}
                </div>
                <div className="events-list112">
                  {attending &&
                    eventsJoined112
                      .slice(currentEventPage * 3, currentEventPage * 3 + 3)
                      .map((event) => (
                        <div
                          className="event112"
                          onClick={() => ViewEventHandler(event.id)}
                        >
                          <div className="event-left112">
                            <div className="event-left-left112">
                              <div className="event-image-container112">
                                <img
                                  className="event-image112"
                                  src={event.eventImage}
                                ></img>
                              </div>
                            </div>
                            <div className="event-left-right112">
                              <div className="event-title112">
                                {event.eventTitle}
                              </div>
                              <div className="event-location112">
                                Location: {event.eventLocation}
                              </div>
                              <div className="event-date112">{event.date}</div>
                            </div>
                          </div>
                          <div className="event-right112">
                            <div className="tags-container112">
                              <div className="tag112">
                                {event.eventCategory}
                              </div>
                              <div className="tag112">
                                {event.eventDifficulty}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  {owned &&
                    eventsOwned112
                      .slice(currentEventPage * 3, currentEventPage * 3 + 3)
                      .map((event) => (
                        <div className="event112">
                          <div
                            className="event-left112"
                            onClick={() => ViewEventHandler(event.id)}
                          >
                            <div className="event-left-left112">
                              <div className="event-image-container112">
                                <img
                                  className="event-image112"
                                  src={event.eventImage}
                                ></img>
                              </div>
                            </div>
                            <div className="event-left-right112">
                              <div className="event-title112">
                                {event.eventTitle}
                              </div>
                              <div className="event-location112">
                                Location: {event.eventLocation}
                              </div>
                              <div className="event-date112">{event.date}</div>
                            </div>
                          </div>
                          <div className="event-right112">
                            <div
                              className="tags-container112"
                              onClick={() => ViewEventHandler(event.id)}
                            >
                              <div className="tag112">
                                {event.eventCategory}
                              </div>
                              <div className="tag112">
                                {event.eventDifficulty}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {attended && (eventsJoinedPast.concat(eventsOwnedPast)).slice(currentEventPage*3,currentEventPage*3+3).map((event) => (
                      <div className="event112" onClick={()=>ViewEventHandler(event.id)}>
                        <div className="event-left112">
                          <div className="event-left-left112">
                            <div className="event-image-container112">
                              <img
                                className="event-image112"
                                src={event.eventImage}
                              ></img>
                            </div>
                          </div>
                          <div className="event-left-right112">
                            <div className="event-title112">
                              {event.eventTitle}
                            </div>
                            <div className="event-location112">
                              Location: {event.eventLocation}
                            </div>
                            <div className="event-date112">
                              {event.date}
                            </div>
                          </div>
                        </div>
                        <div className="event-right112">
                          <div className="tags-container112" onClick={() => ViewEventHandler(event.id)}>
                            <div className="tag112">{event.eventCategory}</div>
                            <div className="tag112">{event.eventDifficulty}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="event-pagination112">
                  {eventsJoined112.length > 3 ||
                    eventsOwned112.length > 3 ||
                    (eventsJoinedPast.length+eventsOwnedPast.length) > 3 ? (
                      <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        pageCount={Math.ceil(attended ? (eventsJoinedPast.length+eventsOwnedPast.length) /3: (attending ? eventsJoined112.length : eventsOwned112.length) / 3)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={(selectedEventPage) => handleEventPageChange(selectedEventPage.selected)}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                        forcePage={currentEventPage}
                      />
                    ) : null}
                </div>
                </>:<><div className="user-private">
                      User has set Event Display to Private
                  </div></>}
              </div>
              </div>
            </div>
            <div className="right112">
              <div className="right-top112"></div>
              <div className="groupsjoined112">
                <div className="groupsjoinedtext112">Groups Joined</div>
                
                <div className="groupsjoinedlist112">
                  {settingGroups&&groupsJoined112.slice(currentJoinedPage*2,currentJoinedPage*2+2).map((group) => (
                    <div className="group-box112" onClick={() => ViewGroupHandler(group.groupId)}>
                      <div className="group-box-left112">
                        <div className="grouptitle112">{group.groupname}</div>
                        <div className="groupmembers112">{group.groupmembers.length} members</div>
                        <div className="group-creator112">Created by {group.groupOwner}</div>
                      </div>
                      <div className="group-box-right112">
                      </div>
                    </div>
                  ))}
                </div>
                {groupsJoined112.length > 2 ? (
                  <ReactPaginate
                  previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                  pageCount={Math.ceil(groupsJoined112.length / 2)}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={2}
                  onPageChange={(selectedJoinedPage) => handleJoinedPageChange(selectedJoinedPage.selected)}
                  containerClassName={'paginationjoined'}
                  activeClassName={'activejoined'}
                  />):null}
              </div>
              <div className="right-bottom112">
              <div className="groupsjoined112">
                  <div className="groupsjoinedtext112">Groups Owned</div>
                  <div className="groupsjoinedlist112">
                    {groupsOwned112.slice(currentOwnedPage * 2, currentOwnedPage * 2 + 2).map((group) => (
                    <div className="group-box112" onClick={() => ViewGroupHandler(group.groupId)}>
                      <div className="group-box-left112">
                        <div className="grouptitle112">{group.groupname}</div>
                        <div className="groupmembers112">{group.groupmembers.length} members</div>
                        <div className="group-creator112">Created by {group.groupOwner}</div>
                      </div>
                      <div className="group-box-right112">
                      </div>
                    </div>
                  ))}
                  </div>
                  {groupsOwned112.length > 2 ? (
                    <ReactPaginate
                        previousLabel={'<'}
                      nextLabel={'>'}
                      breakLabel={'...'}
                        pageCount={Math.ceil(groupsOwned112.length / 2)}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={2}
                        onPageChange={(selectedOwnedPage) => handleOwnedPageChange(selectedOwnedPage.selected)}
                        containerClassName={'paginationowned'}
                        activeClassName={'activeowned'}
                    />) : null}
              </div>
              </div>
            </div>
          </div>
      </div>
    </>
  );
}
export default ViewMemberProfile;
