import { useState } from "react";
import MapContainer from "../EventMap/EventMap.js"
import Filters from "../Filters/Filters.js"
import "./find-events-map-styles.css";


function eventsCard(event){
    return (
        <div className="event-card">
        <div>
            <p className="event-name">{event.name}</p>
            <p className="event-time">{event.date}, {event.time}</p>
            <p className="event-location">{event.location}</p>
            <p className="event-category">{event.category}</p>
            <p className="event-difficulty">{event.difficulty}</p>
            <p className="event-description">{event.description}</p>
        </div>
        <div>
            <p className="event-attendees">{event.attendees} participants</p>
            <button className="join-event">Join</button>
        </div>
        </div>
        
    )
}

function Searchbar({handleSearch}){
    return (
        <input
        name="search"
        type="text"
        className="searchbar"
        placeholder="Search Location"
        onChange={(e) => handleSearch(e)}
    />
    )
}
function EventsMapList({events}){
    const [eventsView, setEventsView] = useState("mapview");
    function changeView(e){
        setEventsView(e.target.id);
          };

    return (
        <div className="events-list">
            <div>
            <button id="mapview" style={{ fontWeight: eventsView === "mapview" ? "bold" : "" }} onClick={(e)=>changeView(e)}>Map View</button>
            <button id="listview" style={{ fontWeight: eventsView === "listview" ? "bold" : "" }} onClick={(e)=>changeView(e)}>List View</button>
            </div>
            <Searchbar/>
            {
                events.map((event) => eventsCard(event))
            }
        </div>
        
    )
}
export default function FindEventsMap(){
    function handleSearch(){
        //
    }
    // sample events
    let events = [
        {
            name: "ippt training",
            date: "2/1/2023",
            time: "7pm",
            location: "tekong",
            category: "Jogging",
            difficulty: "medium",
            description: " ord loh",
            attendees: 5
        },
        {
            name: "naruto run",
            date: "2/1/2023",
            time: "7pm",
            location: "tampines",
            category: "Running",
            difficulty: "beginner",
            description: "SASUKEEEE",
            attendees: 5
        },
        {
            name: "zumba",
            date: "2/1/2023",
            time: "7pm",
            location: "tampines",
            category: "Other",
            difficulty: "beginner",
            description: "dududu",
            attendees: 5
        }
    ]
    return(
        <div className="find-events-page">
            <Filters />
            <MapContainer />
            <EventsMapList events={events}/>
        </div>

    )
}