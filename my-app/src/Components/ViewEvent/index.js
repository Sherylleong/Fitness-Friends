import EventData from "./EventData";
import iconpin from "../Resources/location.png";
import attendee from "../Resources/attendees.png";
import attendee1 from "../Resources/attendee.png";
import arrow from "../Resources/arrow.png";
import GoogleMap from "../EventMap/EventMap.js";
import { useEffect, useState } from "react";
import "./ViewEvent.css";
import { getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../FirebaseDb/Firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { dispatch, useStoreState } from "../../App";
import { useNavigate } from "react-router-dom";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

function ViewEvent() {
  const userId = useStoreState("userId");
  const navigate = useNavigate();
  // FirebaseAuth.getInstance().getCurrentUser()
  console.log("userid:");
  if (!userId) {
    console.log("no user id");
  } else {
    console.log(userId);
  }

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

  //for fetching eventdata using eventid in url
  const { eventId: urlEventId } = useParams(); // retrieve the groupId from the URL parameter
  const [eventId, setEventId] = useState(null); // add a state variable for groupId
  const [event, setEvent] = useState(null); // initialize the group state to null
  // const [groupEvents, setGroupEvents] = useState([]); //for groupevents
  console.log(eventId);

  useEffect(() => {
    setEventId(urlEventId);
  }, [urlEventId]);

  console.log(eventId);

  //for image fetching, converting from url to docs/file
  const [imageUrl, setImageUrl] = useState(null); // initialize the imageUrl state to null
  const storage = getStorage();

  //for data fetching (image and groupdata includigng grpevents)
  useEffect(() => {
    const fetchEvent = async () => {
      const eventDocId = eventId; // use groupId as the document ID to fetch data for
      const eventData = await getByDocID("events", eventDocId); // call the getByDocID function to retrieve data for the specified document ID
      if (eventData) {
        console.log(eventData);
        setEvent(eventData); // set the group state to the retrieved data
        //for image
        const imageRef = ref(storage, eventData.eventImage); // create a reference to the image in Firebase Storage
        getDownloadURL(imageRef)
          .then((url) => {
            setImageUrl(url); // set the imageUrl state to the download URL of the image
          })
          .catch((error) => {
            console.log("Error getting image URL: ", error);
          });
      } else {
        console.log("No matching documents.");
      }
    };

    fetchEvent();
  }, [eventId, storage]); // re-fetch the group whenever the groupId changes

  //for joining event

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

    await updateDoc(eventRef, {
      eventAttendees: arrayUnion(userId),
    });

    // await updateDoc(groupRef, {
    //   groupmembers: arrayUnion(userId), // Add the userId to the groupmembers array
    // });
    // console.log("successfully joined");
  };

  if (!event) {
    return <div clasName="loading">Loading...</div>; // show a loading message if the group state is null
  }

  console.log({ event });
  console.log(eventId);

  return (
    <>
      <div className="full-screen">
        <div className="full">
          <div className="top1">
            <img className="arrow1" src={arrow}></img>

            <div class="image-container1">
              <img className="grp-picture1" src={event.eventImage}></img>
            </div>

            <div className="group-title1">{event.eventTitle}</div>

            <div className="joineventbtn">
              <button className="joinevent" onClick={joinEvent}>
                Join this Event
              </button>
            </div>
          </div>

          <div className="middle1">
            <div className="location1">
              <div clasName="location-img1">
                <img src={iconpin}></img>
              </div>
              <div className="location-name1">{event.eventLocation}</div>
            </div>

            <div className="attendees1">
              <div className="attendee-img1">
                <img src={attendee}></img>
              </div>
              <div className="attendee-numb1">
                {event.eventAttendees.length} attendees{" "}
              </div>
            </div>

            <div className="middle-right1">
              <div className="difficulty ">
                <div className="difficulty-title"> Difficulty </div>
                <div className="tag"> {event.eventDifficulty}</div>
              </div>

              <div className="category">
                <div className="category-title">Category</div>
                <div className="tag"> {event.eventCategory}</div>
              </div>
            </div>
          </div>

          <div className="bottom1">
            <div className="event1">
              <div className="event-title">Event Description:</div>

              <div className="event-desc">{event.eventDescription}</div>
            </div>

            <div className="googlemap">
              <GoogleMap />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewEvent;
