import iconpin from "../Resources/location.png";
import aboutgroup from "../Resources/aboutgroup.png";
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
import { arrayUnion, arrayRemove } from "firebase/firestore";
import calender from "../Resources/calender.png";
import { onSnapshot } from "firebase/firestore";

function ViewGroup() {
  //for user id
  const userId = useStoreState("userId");
  console.log(userId);
  const navigate = useNavigate();

  //for pagination
  const [currentPg, setCurrentPg] = useState(0);
  const handlePageChange = (selectedPage) => {
    setCurrentPg(selectedPage);
  };

  //general getdocbyid function w colllectionname and docid asparameters
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
  const { groupId: urlGroupId } = useParams(); // retrieve the groupId from the URL parameter
  const [groupId, setGroupId] = useState(null); // add a state variable for groupId
  const [group, setGroup] = useState(null); // initialize the group state to null
  const [groupEvents, setGroupEvents] = useState([]); //for groupevents

  useEffect(() => {
    setGroupId(urlGroupId);
  }, [urlGroupId]);

  console.log(groupId);

  //for image fetching, converting from url to docs/file
  const [imageUrl, setImageUrl] = useState(null); // initialize the imageUrl state to null
  const storage = getStorage();

  //for data fetching (image and groupdata includigng grpevents)
  useEffect(() => {
    const fetchGroup = async () => {
      // const groupDocId = groupId; // use groupId as the document ID to fetch data for
      // const groupData = await getByDocID("group", groupDocId); // call the getByDocID function to retrieve data for the specified document ID

      const groupRef = doc(collection(firestore, "group"), groupId);

      if (groupRef) {
        const unsubscribe = onSnapshot(groupRef, (doc) => {
          setGroup(doc.data());
        });

        // console.log(groupData);
        // setGroup(groupData); // set the group state to the retrieved data
        //for image

        const imageRef = ref(storage, groupRef.groupImageURL); // create a reference to the image in Firebase Storage
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

  // for joining  grp -- it works yay!

  /* reference

  const joinEvent = async () => {
    console.log("joining event===");
    console.log(userId);
    console.log(eventId);

    if (!userId) {
      //ok this part works
      navigate("/Login");
      return;
    }

    const eventRef = doc(collection(firestore, "events"), eventId);

    console.log("======++++");
    //this doesnt like check again if it includes or not, like after doing it once, it doesnt update anymore the includes or not..
    console.log(userId);
    console.log(event.eventAttendees.includes(userId));
    if (event.eventAttendees.includes(userId)) {
      await updateDoc(eventRef, {
        eventAttendees: arrayRemove(userId),
      });
      console.log("successfully left");
    } else {
      await updateDoc(eventRef, {
        eventAttendees: arrayUnion(userId),
      });
      console.log("successfully joined");
    }
    // setIsJoined(!isJoined);

    // await updateDoc(groupRef, {
    //   groupmembers: arrayUnion(userId), // Add the userId to the groupmembers array
    // });
  };


  
  */

  const joinGroup = async () => {
    console.log("joining grp===");
    console.log(userId);
    console.log(groupId);

    if (!userId) {
      //ok this part works
      navigate("/Login");
      return;
    }

    const groupRef = doc(collection(firestore, "group"), groupId);

    if (group.groupmembers.includes(userId)) {
      await updateDoc(groupRef, {
        groupmembers: arrayRemove(userId),
      });
      console.log("successfully left");
    } else {
      await updateDoc(groupRef, {
        groupmembers: arrayUnion(userId),
      });
      console.log("successfully joined");
    }

    // await updateDoc(groupRef, {
    //   groupmembers: arrayUnion(userId),
    // });

    // await updateDoc(groupRef, {
    //   groupmembers: arrayUnion(userId), // Add the userId to the groupmembers array
    // });
    // console.log("successfully joined");
  };

  //for viewing grp event

  const handleViewEvent = (eventId) => {
    // history.push(`/Events/ViewEvent/${eventId}`);
    window.location.replace(`/Events/ViewEvent/` + eventId);
  };

  if (!group) {
    return <div clasName="loading">Loading...</div>; // show a loading message if the group state is null
  }
  const handleViewMember = () => {
    navigate("/ViewMembersGroup/" + groupId);
  };
  console.log({ group });
  console.log({ groupEvents });
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
            <div class="image-container">
              <img className="grp-picture" src={imageUrl}></img>
            </div>

            <div className="group-title">{group.groupname}</div>

            <div className="join-group-btn">
              <button className="joinevent" onClick={joinGroup}>
                {group.groupmembers.includes(userId) ? "Leave " : "Join "}
                Group
              </button>
            </div>
          </div>

          <div className="middle">
            <div className="creator-member1">
              <div className="creator-event">
                <div className="creatortitle">
                  <div className="attendee3">
                    <img src={attendee1}></img>
                  </div>
                  <div> Creator: </div>
                </div>

                <div className="creatorname"> </div>
              </div>
              <div className="creator-event" onClick={handleViewMember}>
                <div className="creatortitle">
                  <div className="attendee3">
                    <img src={attendee1}></img>
                  </div>
                  <div> Members: </div>
                </div>

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

            {/* <div className="containerhehe">
              <div className="about"> About our group:</div>
              <div className="grp-desc">"{group.groupdesc}""</div>

              <div className="creator">Created by {group.groupOwner}</div>
            </div> */}

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

                        <div className="eventdate">Date: {event.eventDate}</div>

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
