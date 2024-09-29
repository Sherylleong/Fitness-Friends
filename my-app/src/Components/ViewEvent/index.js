import calender from "../Resources/calender.png";
import location from "../Resources/locationfinal.png";
import attendee1 from "../Resources/attendee.png";
import {
  GoogleMap,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import "./ViewEvent.css";
import { useParams } from "react-router-dom";
import { useStoreState } from "../../App";
import { useNavigate } from "react-router-dom";
import { EventController } from "../../Controller/EventController";

function ViewEvent() {
  const userId = useStoreState("userId");
  const navigate = useNavigate();
  const ec = new EventController();

  const { eventId: urlEventId } = useParams(); // retrieve the groupId from the URL parameter
  const [eventId, setEventId] = useState(null); // add a state variable for groupId
  const [event, setEvent] = useState(null); // initialize the group state to null
  const [joined, setJoined] = useState(false);

  const [eventOver, setEventOver] = useState(false); //Set true if event date has passed
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    setEventId(urlEventId);
    ec.getEventDetails(urlEventId, userId ,setEvent, setEventOver, setJoined);
  }, [urlEventId]);

  const joinEvent = async () => {
    if (!userId) {
      //If not logged in, redirect to Login Screen
      navigate("/Login");
      return;
    }
    ec.joinEvent(event, setEvent, setJoined, eventId, userId);
  };

  if (!event) {
    return <div clasName="loading">Loading...</div>; // show a loading message if the group state is null
  }

  const handleViewMember = () => {
    navigate("/ViewMembersEvent/" + eventId);
  };
  const handleViewCreator = () => {
    navigate("/ViewMemberProfile/" + event.creatorID);
  };
  const isCreator = userId === event.creatorID;

  return (
    <>
      <div className="full-screen">
        <div className="full">
          <div className="top1">
            <div class="image-container1">
              <img className="grp-picture1" src={event.eventImage}></img>
            </div>

            <div className="group-title1">{event.eventTitle}</div>

            <div className="joineventbtn">
              {!isCreator && !eventOver && (
                <button className="joinevent" onClick={joinEvent}>
                  {joined ? "Leave " : "Join "}
                  Event
                </button>
              )}
            </div>
          </div>

          <div className="middle1">
            {/* add eventTime and date, followed up eventlocation, then tags */}

            <div className="date1">
              <div className="date1-top">
                <div className="calender">
                  <img src={calender}></img>
                </div>

                <div className="date1-title">Date and Time</div>
              </div>

              <div className="event-date-time">
                <div className="event-date"> Date: {event.date}</div>
                <div className="event-time"> Time: {event.time}</div>
              </div>
            </div>

            <div className="date1">
              <div className="date1-top">
                <div className="location3">
                  <img src={location}></img>
                </div>

                <div className="date1-title">Location of event</div>
              </div>

              <div className="event-date-time">
                <div className="event-time"> {event.eventLocation}</div>
              </div>
            </div>

            {/* add the creaor n members*/}

            <div className="creator-member">
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
                <div> View members </div>
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
              {/* {event.eventPosition} */}
              <MapContainer event={event} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MapContainer({ event }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: String(process.env.REACT_APP_GMAP_APIKEY),
  });
  if (!isLoaded) return <div>..Loading</div>;
  return <Map event={event} />;
}

function Map({ event }) {
  return (
    <>
      <GoogleMap
        zoom={18}
        center={event.eventPosition}
        mapContainerClassName="map-container"
        options={{
          fullscreenControl: false,
          zoomControl: false,
          gestureHandling: "none",
          keyboardShortcuts: false,
        }}
      >
        <Marker position={event.eventPosition} />
      </GoogleMap>
    </>
  );
}

export default ViewEvent;
