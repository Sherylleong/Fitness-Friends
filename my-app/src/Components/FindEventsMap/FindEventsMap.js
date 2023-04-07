import { useState, useReducer, useEffect } from "react";
import MapContainer from "../EventMap/EventMap.js";
import EventFilters from "../Filters/EventFilters.js";
import "./find-events-map-styles.css";
import { useStoreState } from "../../App";
import { useNavigate, useLocation } from "react-router-dom";
import { EventController } from "../../Controller/EventController.js";

function EventsMapCard(event, navigate, userId) {
  const longEnUSFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: "long",
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const eventId = event.id;
  let joined = (event.eventAttendees.includes(userId) || event.creatorID==userId);
  const handleView = () => {
    navigate("/ViewEvent/" + eventId);
  };

  return (

  <div className="event-map-card" style={{backgroundColor: joined ? "#A8A8A8" : "white", opacity:joined ? "0.5" : "1", paddingLeft:"15px"}}>
    <p className="event-map-name">{event.eventTitle}</p>
    <div className="event-map-card-content"  style={{display: "flex", flexDirection: "row", justifyContent:"space-between"}}>
      <div className="event-map-left">
        <p className="event-map-time">
        {longEnUSFormatter.format(new Date(event.date))}<br></br>{new Date('1970-01-01T' + event.time + 'Z').toLocaleTimeString('en-US',
    {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
  )}
        </p>
        <p className="event-map-location">{event.eventLocation}</p>
        <p className="event-map-category">{event.eventCategory}</p>
        <p className="event-map-difficulty">{event.eventDifficulty}</p>
      </div>
        <div className="event-map-right">
        <p className="event-map-attendees">
          {event.eventAttendees.length + 1} attendee(s) 
        </p>
        <button className="view-event-find-map" onClick={handleView}>
          View
        </button>
      </div>
    </div>
  </div>

  );
}

function EventsListCard(event, navigate,userId) {
  const longEnUSFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: "long",
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const eventId = event.id;
  let joined = (event.eventAttendees.includes(userId))
  console.log(joined);
  console.log(333)
  console.log("event:");
  console.log(event.id);
  const handleView = () => {
    navigate("/ViewEvent/" + eventId);
  };
  //#C0C0C0
  return (
    <div className="event-list-card" style={{backgroundColor:joined ? "#C0C0C0" : "white", opacity:joined ? "0.5" : "1", paddingLeft:"15px", paddingRight:"70px"}}>
      <div className="event-list-img">
        <div className="crop">
          <img src={event.eventImage} />
        </div>
      </div>
      <div className="list-card-desc">
        <h1 className="event-list-name">{event.eventTitle}</h1>
        <p className="event-list-time">
        {longEnUSFormatter.format(new Date(event.date))} at {new Date('1970-01-01T' + event.time + 'Z').toLocaleTimeString('en-US',
    {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
  )}
        </p>
        <p className="event-list-location">{event.eventLocation}</p>
        <p className="event-list-attendees">
          {event.eventAttendees.length} attendee(s)
        </p>
      </div>
      <div className="list-card-tags">
        <p className="event-list-category">{event.eventCategory}</p>
        <p className="event-list-difficulty">{event.eventDifficulty}</p>
      </div>
      <div>
        <button className="view-event-find" onClick={handleView}>
          View
        </button>
      </div>
    </div>
  );
}

function Searchbar({ handleFilters, searchText, filters}) {
  return (
    <input
      id="locationsearch"
      name="search"
      type="text"
      value={filters.search}
      className="searchbar"
      placeholder={searchText}
      onChange={(e) => handleFilters(e)}
    />
  );
}
function EventMapHeader({ eventsView, setEventsView }) {
  function changeView(e) {
    setEventsView(e.target.id);
  }
  return (
    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
      <h1 style={{ marginTop: "0px", position: "relative", right: "130px" }}>
        Filters
      </h1>
      <h1 style={{ marginTop: "0px", position: "relative", fontSize: "50px" }}>
        Search Events
      </h1>
      <div style={{ marginTop: "0px", position: "relative", left: "150px" }}>
        <button
          id="mapview"
          style={{ fontWeight: eventsView === "mapview" ? "bold" : "" }}
          onClick={(e) => changeView(e)}
        >
          Map View
        </button>
        <button
          id="listview"
          style={{
            fontWeight: eventsView === "listview" ? "bold" : ""
          }}
          onClick={(e) => changeView(e)}
        >
          List View
        </button>
      </div>
    </div>
  );
}
function EventsMapList({ filters, events, handleFilters, navigate,userId }) {
  return (
    <div className="events-map-list">
      <div>
      <Searchbar
        filters={filters}
        handleFilters={handleFilters}
        searchText="Search Location..."
      />
      </div>
      <div className="events-map-list-div">
        {events.map((event) => EventsMapCard(event,navigate,userId))}
      </div>
    </div>
  );
}
function EventsListList({ filters, events, handleFilters,navigate,userId}) {
  return (
    <div className="events-list-list">
      <div style={{ position: "relative", left: "-350px" }}>
        <Searchbar filters={filters} handleFilters={handleFilters} searchText="Search Event..." />
      </div>
      {events.map((event) => EventsListCard(event, navigate, userId))}
    </div>
  );
}

export default function FindEventsMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]); // user's joined groups
  const userId = useStoreState("userId");
  var today = new Date()
  const ec = new EventController();



  useEffect(() => {
    ec.getAllEvents(setEvents);
    ec.getUserGroups(userId, setGroups);
  }, []); // re-fetch the events whenever anything changes

    //const [events, setEvents] = useState(eventsdb);
    const [eventsView, setEventsView] = useState("mapview");

    const [filters, setFilters] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            search: "",
            difficulty: [],
            startDate: "",
            endDate: "",
            category: location.state? [location.state.category] : [],
            groups: []
        }
      );


  function handleFilters(event) {
    const name = event.target.name;
    const newValue = event.target.value;
    if (event.target.type === "checkbox") {
      // checkboxes need multiple values ie array
      if (event.target.checked) {
        // box checked, add to filter
        let newFiltersList = [...filters[name]];
        newFiltersList.push(newValue);
        setFilters({ [name]: newFiltersList });
      } else {
        // box unchecked, remove from filter
        let newFiltersList = [...filters[name]];
        newFiltersList = newFiltersList.filter((v) => v !== newValue);
        setFilters({ [name]: newFiltersList });
      }
    } else {
      setFilters({ [name]: newValue });
    }
  }


  function filterEvents(events, filters, eventsView) {
    let filteredEvents = events.filter((event) => {
      let eventDate = new Date(event.date);
      if (
        filters.difficulty.length !== 0 &&
        !filters.difficulty.includes(event.eventDifficulty)
      )
        return false;
      if (
        filters.category.length !== 0 &&
        !filters.category.includes(event.eventCategory)
      )
        return false;
      if (
        filters.groups.length !== 0 &&
        !filters.groups.includes(event.groupId)
      )
        return false;


      if (filters.startDate !== "") {

        console.log(event.date);
        console.log(filters.startDate);

        let filterStartDate = new Date(filters.startDate);
        let chosenYear = filters.startDate.substring(0,4);
        if ((Number(chosenYear)< 2023) || eventDate.getTime() < filterStartDate.getTime()) {
          return false;
        }

      }
      let chosenYear = filters.endDate.substring(0,4);
      if ((Number(chosenYear)< 2023) || filters.endDate !== "") {
        let filterEndDate = new Date(filters.endDate);
        if (eventDate.getTime() > filterEndDate.getTime()) return false;
      }

      if (eventDate.getTime() < today.getTime()) return false; 
  
      if (eventsView === "mapview")
        return (
          event.eventLocation
            .toLowerCase()
            .indexOf(filters.search.toLowerCase()) !== -1
        );

      return (
        event.eventTitle.toLowerCase().indexOf(filters.search.toLowerCase()) !==
        -1
      );
    });

    return filteredEvents;
  }

  let filteredEvents = filterEvents(events, filters, eventsView);


    return(
        <div className="find-events-page" >{/*col*/}
            <EventMapHeader eventsView={eventsView} setEventsView={setEventsView} />{/*row*/}
            {eventsView==="mapview" ?
            (<EventMapInfo navigate={navigate} groups={groups} filters={filters} setFilters={setFilters} handleFilters={handleFilters} events={filteredEvents} eventsView={eventsView} setEventsView={setEventsView} userId={userId} />)
        : (<EventListInfo navigate={navigate} groups={groups} filters={filters} handleFilters={handleFilters} events={filteredEvents} userId={userId} />)}
        </div>

    )
}

function EventMapInfo({groups, navigate, filters, setFilters, handleFilters, events, eventsView, setEventsView,userId}){
    return (
      <div className="event-map-info">
        <EventFilters groups={groups} filters={filters} handleFilters={handleFilters}/>
        <MapContainer events={events} setFilters={setFilters}/>
        <EventsMapList filters={filters} navigate={navigate} events={events}  handleFilters={handleFilters} userId={userId}/>    
      </div>
  );
}

function EventListInfo({groups, navigate, filters, handleFilters, events,userId}){
    return (
        <div className="event-list-info">
        <EventFilters groups={groups} filters={filters} handleFilters={handleFilters}/>
        <EventsListList filters={filters} navigate={navigate} events={events} handleFilters={handleFilters} userId={userId}/>    
    </div>
  );
}
