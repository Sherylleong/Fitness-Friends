import { useState,useReducer, useEffect  } from "react";
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
        </div>
        <div>
            <p className="event-attendees">{event.attendees} participants</p>
            <button className="join-event">Join</button>
        </div>
        </div>
        
    )
}

function Searchbar({handleFilters}){
    return (
        <input 
        id="locationsearch"
        name="searchLocation"
        type="text"
        className="searchbar"
        placeholder="Search Location"
        onChange={(e) => handleFilters(e)}
    />
    )
}
function EventsMapList({events, eventsView,setEventsView,handleFilters}){
    function changeView(e){
        setEventsView(e.target.id);
          };

    return (
        <div className="events-map-list">
            <div>
            <button id="mapview" style={{ fontWeight: eventsView === "mapview" ? "bold" : "" }} onClick={(e)=>changeView(e)}>Map View</button>
            <button id="listview" style={{ fontWeight: eventsView === "listview" ? "bold" : "" }} onClick={(e)=>changeView(e)}>List View</button>
            </div>
            <Searchbar handleFilters={handleFilters}/>
            {
                events.map((event) => eventsCard(event))
            }
        </div>
        
    )
}


export default function FindEventsMap(){

    let eventsdb = [
        {
            name: "ippt training",
            date: "2023-02-05",
            time: "7pm",
            location: "tekong",
            category: "Jogging",
            difficulty: "Intermediate",
            description: " ord loh",
            attendees: 5,
            group: "tekong bois"
        },
        {
            name: "naruto run",
            date: "2023-03-01",
            time: "7pm",
            location: "tampines",
            category: "Running",
            difficulty: "Beginner",
            description: "SASUKEEEE",
            attendees: 5,
            group: "naruto bois"
        },
        {
            name: "sasuke run",
            date: "2023-02-01",
            time: "7pm",
            location: "tampines",
            category: "Running",
            difficulty: "Beginner",
            description: "SASUKEEEE",
            attendees: 5,
            group: "naruto bois"
        },
        {
            name: "zumba",
            date: "2023-02-02",
            time: "7pm",
            location: "tampines",
            category: "Other",
            difficulty: "Beginner",
            description: "dududu",
            attendees: 5,
            group: "bois"
        }
    ]

    //const [events, setEvents] = useState(eventsdb);
    const [eventsView, setEventsView] = useState("mapview");
    let events = eventsdb;
    const [filters, setFilters] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            searchLocation: "",
            difficulty: [],
            startDate: "",
            endDate: "",
            category: [],
            groups: []
        }
      );
      let groups =   Array.from(new Set(events.map((event)=>event.group)));

        events = (filterEvents(eventsdb, filters));

  

    function handleFilters(event){
        const name = event.target.name;
        const newValue = event.target.value;
        if (event.target.type === "checkbox"){ // checkboxes need multiple values ie array
            if (event.target.checked){ // box checked, add to filter
                let newFiltersList = [...filters[name]];
                newFiltersList.push(newValue);
                setFilters({ [name]: newFiltersList });
            }
            else { // box unchecked, remove from filter
                let newFiltersList = [...filters[name]];
                newFiltersList = newFiltersList.filter(v => v !== newValue);
                setFilters({ [name]: newFiltersList });
            }
        }
        else {
            setFilters({ [name]: newValue });
        }
    }

    function filterEvents(events, filters){
        let filteredEvents = events.filter((event) => {
            if (filters.difficulty.length !==0 && !(filters.difficulty.includes(event.difficulty))) return false;
            if (filters.category.length !==0 && !(filters.category.includes(event.category))) return false;
            if (filters.groups.length !==0 && !(filters.groups.includes(event.group))) return false;
            let eventDate = new Date(event.date); 
            if (filters.startDate !== ""){
                let filterStartDate = new Date(filters.startDate);
                if (eventDate < filterStartDate) return false;
            }
            if (filters.endDate !== ""){
                let filterEndDate = new Date(filters.endDate);
                if (eventDate > filterEndDate) return false;
            }
            return event.location.toLowerCase().indexOf(filters.searchLocation.toLowerCase()) !==-1;
        })
        return filteredEvents;
    }

    return(
        <div className="find-events-page">
            <Filters groups={groups} handleFilters={handleFilters}/>
            <MapContainer />
            <EventsMapList events={events} eventsView={eventsView} setEventsView={setEventsView} handleFilters={handleFilters}/>
        </div>

    )
}