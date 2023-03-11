import GroupData from "./GroupData";
import iconpin from "../Resources/location.png";
import attendee from "../Resources/attendees.png";
import attendee1 from "../Resources/attendee.png";
import arrow from "../Resources/arrow.png";
import { useEffect, useState } from "react";
import "./ViewGroup.css";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../FirebaseDb/Firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function ViewGroup() {
  //for pagination
  const [currentPg, setCurrentPg] = useState(0);
  const handlePageChange = (selectedPage) => {
    setCurrentPg(selectedPage);
  };

  //for fetching data using groupId
  const { groupId } = useParams(); // retrieve the groupId from the URL parameter
  const [group, setGroup] = useState(null); // initialize the group state to null
  console.log(groupId);

  //for image fetching, converting from url to docs/file
  const [imageUrl, setImageUrl] = useState(null); // initialize the imageUrl state to null
  const storage = getStorage();

  //for data fetching
  useEffect(() => {
    const fetchGroup = async () => {
      const groupsRef = collection(firestore, "group");
      const q = query(groupsRef, where("groupId", "==", groupId));
      const querySnapshot = await getDocs(q).catch((error) => {
        console.log("Error getting documents: ", error);
      });
      if (querySnapshot.empty) {
        console.log("No matching documents.");
      } else {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          setGroup(doc.data()); // set the group state to the data of the matching document
          //for image
          const imageRef = ref(storage, doc.data().groupImageURL); // create a reference to the image in Firebase Storage
          getDownloadURL(imageRef)
            .then((url) => {
              setImageUrl(url); // set the imageUrl state to the download URL of the image
            })
            .catch((error) => {
              console.log("Error getting image URL: ", error);
            });
        });
      }
    };

    fetchGroup();
  }, [groupId]); // re-fetch the group whenever the groupId changes

  if (!group) {
    return <div>Loading...</div>; // show a loading message if the group state is null
  }

  console.log({ group });
  console.log(groupId);

  //end data fetching

  return (
    <>
      <div clasName="full-screen">
        <div className="full">
          <div className="top">
            <img className="arrow" src={arrow}></img>

            <div class="image-container">
              <img className="grp-picture" src={imageUrl}></img>
            </div>

            <div className="group-title">{group.groupname}</div>

            <div className="join-group-btn">
              <button className="join-grp" type="submit">
                Join this Group
              </button>
            </div>
          </div>

          <div className="middle">
            <div className="attendees">
              <div className="attendee-img">
                <img src={attendee}></img>
              </div>
              <div className="attendee-numb">
                {group.groupmembers.length} attendees{" "}
              </div>
            </div>
            <div className="containerhehe">
              <div className="about"> About our group:</div>
              <div className="grp-desc">"{group.groupdesc}""</div>

              <div className="creator">Created by {group.creator}</div>
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

            {group.groupevents.length !== 0 ? (
              <div className="grpevents">
                {group.groupevents
                  .slice(currentPg * 5, currentPg * 5 + 5)
                  .map((event) => (
                    <div className="event" key={event.eventid}>
                      <div className="left">
                        <div className="eventtitle">{event.eventtitle}</div>
                        <div className="eventdate">Date: {event.eventdate}</div>
                        <div className="eventlocation">
                          Location: {event.eventlocation}
                        </div>
                      </div>

                      <div className="right">
                        <div className="attendees-img">
                          {" "}
                          <img src={attendee1}></img>
                        </div>

                        <div>{event.eventattendees} participants</div>
                        <div className="join-event-btn">
                          <button className="join-event" type="submit">
                            Join
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                <div className="event-pagination112">
                  {group.events.length > 5 ? (
                    <ReactPaginate
                      previousLabel={"<"}
                      nextLabel={">"}
                      breakLabel={"..."}
                      pageCount={Math.ceil(group.events.length / 5)}
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
