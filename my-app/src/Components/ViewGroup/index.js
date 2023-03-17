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
import { doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { dispatch, useStoreState } from "../../App";
import { useNavigate } from "react-router-dom";

function ViewGroup() {
  //for join grp, check if user is logged in first, get use state -- need to check! (then add to viewevent)
  const userId = useStoreState("userId");
  const navigate = useNavigate();

  //for pagination
  const [currentPg, setCurrentPg] = useState(0);
  const handlePageChange = (selectedPage) => {
    setCurrentPg(selectedPage);
  };

  //geenral getdocbyid function w colllectionname and docid asparameters
  const getByDocID = async (collectionName, docID) => {
    const docRef = doc(firestore, collectionName, docID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("Document does not exist");
      return null;
    }
  };

  //for fetching groupdata using groupId in url
  const { groupId } = useParams(); // retrieve the groupId from the URL parameter
  const [group, setGroup] = useState(null); // initialize the group state to null
  const [groupEvents, setGroupEvents] = useState([]); //for groupevents
  console.log(groupId);

  //for image fetching, converting from url to docs/file
  const [imageUrl, setImageUrl] = useState(null); // initialize the imageUrl state to null
  const storage = getStorage();

  //for data fetching (image and groupdata includigng grpevents)
  useEffect(() => {
    const fetchGroup = async () => {
      const groupDocId = groupId; // use groupId as the document ID to fetch data for
      const groupData = await getByDocID("group", groupDocId); // call the getByDocID function to retrieve data for the specified document ID
      if (groupData) {
        console.log(groupData);
        setGroup(groupData); // set the group state to the retrieved data
        //for image
        const imageRef = ref(storage, groupData.groupImageURL); // create a reference to the image in Firebase Storage
        getDownloadURL(imageRef)
          .then((url) => {
            setImageUrl(url); // set the imageUrl state to the download URL of the image
          })
          .catch((error) => {
            console.log("Error getting image URL: ", error);
          });

        // data fetching for eventid that has groupid inside
        const eventsRef = collection(firestore, "events");
        const q = query(eventsRef, where("groupId", "==", groupId));
        const querySnapshot = await getDocs(q).catch((error) => {
          console.log("Error getting documents: ", error);
        });
        if (querySnapshot.empty) {
          console.log("No matching documents.");
        } else {
          const fetchedEvents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGroupEvents(fetchedEvents);
        }
      } else {
        console.log("No matching documents.");
      }
    };

    fetchGroup();
  }, [groupId, storage]); // re-fetch the group whenever the groupId changes

  //for joining  grp -- need to check
  const handleJoinGroup = async () => {
    if (!userId) {
      navigate("/Login");
      return;
    }

    const groupRef = doc(firestore.collection("group"), groupId);
    const groupData = await getDoc(groupRef);
    await updateDoc(groupRef, {
      groupMembers: [...groupData.data().groupmembers, userId],
    });
  };

  if (!group) {
    return <div clasName="loading">Loading...</div>; // show a loading message if the group state is null
  }

  console.log({ group });
  console.log(groupId);

  //end data fetching

  //data fetching for eventid that has groupid inside

  // useEffect(() => {
  //   const fetchGroupEvents = async () => {
  //     const eventsRef = collection(firestore, "events");
  //     const q = query(eventsRef, where("groupId", "==", groupId));
  //     const querySnapshot = await getDocs(q).catch((error) => {
  //       console.log("Error getting documents: ", error);
  //     });
  //     if (querySnapshot.empty) {
  //       console.log("No matching documents.");
  //     } else {
  //       const fetchedEvents = querySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setGroupEvents(fetchedEvents);
  //     }
  //   };

  //   fetchGroupEvents();
  // }, [groupId]);

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

            {groupEvents.length !== 0 ? (
              <div className="grpevents">
                {groupEvents
                  .slice(currentPg * 5, currentPg * 5 + 5)
                  .map((event) => (
                    <div className="event" key={event.docid}>
                      <div className="left">
                        <div className="eventtitle">{event.EventTitle}</div>

                        <div className="eventdate">Date: {event.EventDate}</div>

                        <div className="eventlocation">
                          Location: {event.EventLocation}
                        </div>
                      </div>

                      <div className="right">
                        <div className="attendees-img">
                          {" "}
                          <img src={attendee1}></img>
                        </div>

                        <div>{event.EventAttendees.length} participants</div>
                        <div className="join-event-btn">
                          <button className="join-event" type="submit">
                            Join
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
