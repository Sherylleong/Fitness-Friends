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
import { doc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../FirebaseDb/Firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function ViewEvent() {
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
  const { eventId } = useParams(); // retrieve the groupId from the URL parameter
  const [event, setEvent] = useState(null); // initialize the group state to null
  // const [groupEvents, setGroupEvents] = useState([]); //for groupevents
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
              <img className="grp-picture1" src={event.EventImage}></img>
            </div>

            <div className="group-title1">{event.EventTitle}</div>

            <div className="joineventbtn">
              <button className="joinevent" type="submit">
                Join this Event
              </button>
            </div>
          </div>

          <div className="middle1">
            <div className="location1">
              <div clasName="location-img1">
                <img src={iconpin}></img>
              </div>
              <div className="location-name1">{event.EventLocation}</div>
            </div>

            <div className="attendees1">
              <div className="attendee-img1">
                <img src={attendee}></img>
              </div>
              <div className="attendee-numb1">
                {event.EventAttendees.length} attendees{" "}
              </div>
            </div>

            <div className="middle-right1">
              <div className="difficulty ">
                <div className="difficulty-title"> Difficulty </div>
                <div className="tag"> {event.Difficulty}</div>
              </div>

              <div className="category">
                <div className="category-title">Category</div>
                <div className="tag"> {event.Category}</div>
              </div>
            </div>
          </div>

          <div className="bottom1">
            <div className="event1">
              <div className="event-title">Event Description:</div>

              <div className="event-desc">{event.EventDescription}</div>
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
