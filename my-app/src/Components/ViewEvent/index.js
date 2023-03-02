import EventData from "./EventData";
import iconpin from "../Resources/location.png";
import attendee from "../Resources/attendees.png";
import attendee1 from "../Resources/attendee.png";
import arrow from "../Resources/arrow.png";
import { useEffect, useState } from "react";
import "./ViewEvent.css";

function ViewEvent() {
  return (
    <>
      <div className="full-screen">
        {EventData.map((event) => (
          <div className="full">
            <div className="top1">
              <img className="arrow1" src={arrow}></img>

              <div class="image-container1">
                <img className="grp-picture1" src={event.eventimage}></img>
              </div>

              <div className="group-title1">{event.eventtitle}</div>

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
                <div className="location-name1">{event.eventlocation}</div>
              </div>

              <div className="attendees1">
                <div className="attendee-img1">
                  <img src={attendee}></img>
                </div>
                <div className="attendee-numb1">
                  {event.eventattendees} attendees{" "}
                </div>
              </div>
              <div className="containerhehe1">
                <div className="creator-img">
                  <img
                    className="creator-img-img"
                    src={event.eventcreatorimg}
                  ></img>
                </div>
                <div className="creator1">Created by {event.eventcreator}</div>
              </div>

              <div className="middle-right1">
                <div className="tag-title1"> Tags</div>

                <div className="tags-container1">
                  {event.eventtags.map((tag, index) => (
                    <div key={index} className="tag1">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bottom1">
            <div clasName = "bottom1-left"> 
            
            
              <div className ='event-desc-title'>   Event Description: </div>

              <div className ='event-desc-body'>   {event.eventdescription}  </div>



              </div>

            <div className = 'bottom1-right'> 
            gooogle map

            </div>

            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ViewEvent;
