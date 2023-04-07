import aboutgroup from "../Resources/aboutgroup.png";
import attendee1 from "../Resources/attendee.png";
import { useEffect, useState } from "react";
import "./ViewGroup.css";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";
import { useStoreState } from "../../App";
import { useNavigate } from "react-router-dom";
import { GroupController } from "../../Controller/GroupController";

function ViewGroup() {
  //for user id
  const userId = useStoreState("userId");
  const navigate = useNavigate();
  const gc = new GroupController();
  //for pagination
  const [currentPg, setCurrentPg] = useState(0);
  const handlePageChange = (selectedPage) => {
    setCurrentPg(selectedPage);
  };

  //for fetching groupdata using groupId in url
  const { groupId: urlGroupId } = useParams(); // retrieve the groupId from the URL parameter
  const [groupId, setGroupId] = useState(null); // add a state variable for groupId
  const [group, setGroup] = useState([]); // initialize the group state to null
  const [groupEvents, setGroupEvents] = useState([]); //for groupevents
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    gc.getGroupDetails(urlGroupId, userId, setGroup, setGroupEvents, setJoined);
    setGroupId(urlGroupId);
  }, [urlGroupId]);


  const joinGroup = () => {
    if (!userId) {
      //ok this part works
      navigate("/Login");
      return;
    }
    gc.joinGroup(group, setGroup, setJoined, groupId, userId);
  };


  if (!group) {
    return <div clasName="loading">Loading...</div>; // show a loading message if the group state is null
  }

  const handleViewEvent = (eventId) => {
    navigate("/ViewEvent/" + eventId);
  };

  const handleViewMember = () => {
    navigate("/ViewMembersGroup/" + groupId);
  };
  const handleViewCreator = () => {
    navigate("/ViewMemberProfile/" + group.groupOwner);
  };

  var isCreator1 = false;
  if (userId != "") {
    isCreator1 = userId === group.groupOwner;
  }

  return (
    <>
      <div clasName="full-screen">
        <div className="full">
          <div className="top">
            <div class="image-container">
              <img className="grp-picture" src={group.groupImageURL}></img>
            </div>

            <div className="group-title">{group.groupname}</div>

            <div className="join-group-btn">
              {!isCreator1 && (
                <button className="joinevent" onClick={joinGroup}>
                  {joined ? "Leave " : "Join "}
                  Group
                </button>
              )}
            </div>
          </div>

          <div className="middle">
            <div className="creator-member1">
              <div className="creator-event" onClick={handleViewCreator}>
                <div className="attendee3">
                  <img src={attendee1}></img>
                </div>
                <div> View Creator </div>
              </div>

              <div className="creator-event" onClick={handleViewMember}>
                <div className="attendee3">
                  <img src={attendee1}></img>
                </div>
                <div> View Members </div>

                <div className="creatorname"> </div>
              </div>
            </div>

            <div className="date2">
              <div className="date1-top">
                <div className="calender">
                  <img src={aboutgroup}></img>
                </div>

                <div className="date1-title">About Group</div>
              </div>

              <div className="about-group">{group.groupdesc}</div>
            </div>

            <div className="middle-right">
              <div className="difficulty ">
                <div className="difficulty-title"> Difficulty </div>
                <div className="tag"> {group.groupdifficulty}</div>
              </div>

              <div className="category">
                <div className="category-title">Category</div>
                <div className="tag"> {group.groupcategory}</div>
              </div>
            </div>
          </div>

          <div className="bottom">
            <div className="upcoming"> Upcoming Events </div>

            {groupEvents.length !== 0 ? (
              <div className="grpevents">
                {groupEvents
                  .slice(currentPg * 5, currentPg * 5 + 5)
                  .map((event) => (
                    <div className="event" key={event.id}>
                      <div className="left">
                        <div className="eventtitle">{event.eventTitle}</div>

                        <div className="eventdate">Date: {event.date}</div>

                        <div className="eventlocation">
                          Location: {event.eventLocation}
                        </div>
                      </div>

                      <div className="right">
                        <div className="attendees-img">
                          {" "}
                          <img src={attendee1}></img>
                        </div>

                        <div>{event.eventAttendees.length} participants</div>
                        <div className="join-event-btn">
                          <button
                            className="join-event"
                            onClick={() => handleViewEvent(event.id)}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                <div className="event-pagination112">
                  {groupEvents.length > 5 ? (
                    <ReactPaginate
                      previousLabel={"<"}
                      nextLabel={">"}
                      breakLabel={"..."}
                      pageCount={Math.ceil(groupEvents.length / 5)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={3}
                      onPageChange={(selectedPg) =>
                        handlePageChange(selectedPg.selected)
                      }
                      containerClassName={"pagination"}
                      activeClassName={"active"}
                    />
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="no-events">No upcoming events</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewGroup;
