import GroupData from "./GroupData";
import iconpin from "../Resources/location.png";
import attendee from "../Resources/attendees.png";
import attendee1 from "../Resources/attendee.png";
import arrow from "../Resources/arrow.png";
import { useEffect, useState } from "react";
import "./ViewGroup.css";
import ReactPaginate from "react-paginate";

function ViewGroup() {
  const [currentPg, setCurrentPg] = useState(0);

  const handlePageChange = (selectedPage) => {
    setCurrentPg(selectedPage);
  };

  return (
    <>
      <div clasName="full-screen">
        {GroupData.map((group) => (
          <div className="full">
            <div className="top">
              <img className="arrow" src={arrow}></img>

              <div class="image-container">
                <img className="grp-picture" src={group.image}></img>
              </div>

              <div className="group-title">{group.title}</div>

              <div className="join-group-btn">
                <button className="join-grp" type="submit">
                  Join this Group
                </button>
              </div>
            </div>

            <div className="middle">
              <div className="location">
                <div clasName="location-img">
                  <img src={iconpin}></img>
                </div>
                <div className="location-name">{group.location}</div>
              </div>

              <div className="attendees">
                <div className="attendee-img">
                  <img src={attendee}></img>
                </div>
                <div className="attendee-numb">
                  {group.attendees} attendees{" "}
                </div>
              </div>
              <div className="containerhehe">
                <div className="about"> About our group:</div>
                <div className="grp-desc">"{group.groupdesc}""</div>

                <div className="creator">Created by {group.creator}</div>
              </div>

              <div className="middle-right">
                <div className="tag-title"> Tags</div>

                <div className="tags-container">
                  {group.tags.map((tag, index) => (
                    <div key={index} className="tag">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bottom">
              <div className="upcoming"> Upcoming Events </div>

              <div className="grpevents">
                {group.events
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
              </div>
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
          </div>
        ))}
      </div>
    </>
  );
}

export default ViewGroup;
