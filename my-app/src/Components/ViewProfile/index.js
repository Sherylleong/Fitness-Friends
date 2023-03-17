import ProfileData from "./ProfileData";
import { useState, useEffect } from "react";
import "./ViewProfile.css";
import ReactPaginate from "react-paginate";
import { dispatch, useStoreState } from "../../App"
import { firestore } from "../FirebaseDb/Firebase";
import 'firebase/firestore';
import { async } from "@firebase/util";
import { useNavigate } from "react-router-dom";
import {collection,doc,documentId,getDocs, query, where } from "firebase/firestore";

function ViewProfile() {
  // set up attending and owned events
  const userId = useStoreState("userId");
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
  const navigate = useNavigate();

  const [currentEventPage, setcurrentEventPage] = useState(0);
  const [currentJoinedPage, setCurrentJoinedPage] = useState(0);
  const [currentOwnedPage, setCurrentOwnedPage] = useState(0);

  const handleEventPageChange = (selectedEventPage) => {
    setcurrentEventPage(selectedEventPage);
  };
  const handleJoinedPageChange = (selectedJoinedPage) => {
    setCurrentJoinedPage(selectedJoinedPage);
  };

  const handleOwnedPageChange = (selectedOwnedPage) => {
    setCurrentOwnedPage(selectedOwnedPage);
  };
  const [profile2, setProfile2] = useState("");
  const [groupsJoined112, setGroupsJoined112] = useState([]);
  const getGroupsJoined = async () => {
    const docRef = query(collection(firestore, "group"), where("groupmembers", "array-contains", userId));
    const docu = await getDocs(docRef);
    const updatedDocs = docu.docs.map(async (doc) => {
      const updatedGroup = { ...doc.data() };
      const groupOwner = await getGroupOwnerName(updatedGroup.groupOwner);
      updatedGroup.groupOwner = groupOwner;
      return updatedGroup;
    });
    const updatedGroups = await Promise.all(updatedDocs);
    setGroupsJoined112(updatedGroups);
  };
  
  async function getGroupOwnerName(groupOwnerId) {
    const docRef = query(collection(firestore, "users"), where("userId", "==", groupOwnerId));
    const docu = await getDocs(docRef);
    const owner = docu.docs[0].data();
    return owner.displayName;
  }
  
  const [groupsOwned112, setGroupsOwned112] = useState([]);
  const getGroupsOwned = async () => {
    const docRef = query(collection(firestore, "group"), where("groupOwner", "==", userId));
    const docu = await getDocs(docRef);
    const updatedDocs = docu.docs.map(async (doc) => {
      const updatedGroup = { ...doc.data() };
      const groupOwner = await getGroupOwnerName(updatedGroup.groupOwner);
      updatedGroup.groupOwner = groupOwner;
      return updatedGroup;
    });
    const updatedGroups = await Promise.all(updatedDocs);
    setGroupsOwned112(updatedGroups);


  };

  
  const getProfile = async () => {
    const docRef = query(collection(firestore, "users"), where("userId", "==", userId));
    const docu = await getDocs(docRef);
    docu.forEach((doc) => {
      setProfile2(doc.data());
    });
  };
  
  const navigateEditProfile = () => {
      navigate("/EditProfile");
  }

  useEffect(() => {
    getGroupsOwned();
    getGroupsJoined();
    getProfile();
  }, []);

  console.log(groupsJoined112);
  console.log(groupsOwned112);
  console.log({profile2});
  console.log(userId);


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
                        src={profile2.profilePic}
                      ></img>
                    </div>
                  </div>

                  <div className="edit-profile-button112">
                    <button className="edit-profile112" type="submit" onClick={navigateEditProfile}>
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="left-top-right112">
                  <div className="profilename112">{profile2.displayName}</div>
                  <div className="joined112">Joined: {profile2.JoinedDate}</div>
                  <div className="locationtext112">Location: {profile2.Location}</div>
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
                    {attending && profile.eventsattending.slice(currentEventPage*3,currentEventPage*3+3).map((event) => (
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
                    {owned && profile.eventsowned.slice(currentEventPage*3,currentEventPage*3+3).map((event) => (
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
                        onPageChange={(selectedEventPage) => handleEventPageChange(selectedEventPage.selected)}
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
                <div className="groupsjoinedtext112">Groups Joined</div>
                
                <div className="groupsjoinedlist112">
                  {groupsJoined112.slice(currentJoinedPage*2,currentJoinedPage*2+2).map((group) => (
                    <div className="group-box112" key={group.groupid}>
                      <div className="group-box-left112">
                        <div className="grouptitle112">{group.groupname}</div>
                        <div className="groupmembers112">{group.groupmembers.length} members</div>
                        <div className="group-creator112">Created by {group.groupOwner}</div>
                      </div>
                      <div className="group-box-right112">
                        {/* add a leave group button */}
                        <button className="leave-group112" type="submit">
                          Leave Group
                        </button>
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
                    <div className="group-box112" key={group.groupid}>
                      <div className="group-box-left112">
                        <div className="grouptitle112">{group.groupname}</div>
                        <div className="groupmembers112">{group.groupmembers.length} members</div>
                        <div className="group-creator112">Created by {group.groupOwner}</div>
                      </div>
                      <div className="group-box-right112">
                        <button className="manage-group112" type="submit">
                          Manage Group
                        </button>
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
        ))}
      </div>
    </>
  );
}
export default ViewProfile;
