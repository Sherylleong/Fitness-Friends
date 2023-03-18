import { useState,useReducer, useEffect  } from "react";
import MapContainer from "../EventMap/EventMap.js"
import EventFilters from "../Filters/EventFilters.js"
import "./find-events-map-styles.css";
import { firestore } from "../FirebaseDb/Firebase";
import { doc, collection, query, where, getDocs } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { dispatch, useStoreState } from "../../App"


function eventsMapCard(event){
    return (
        <div className="event-map-card">
        <div className="event-map-left">
            <p className="event-map-name">{event.eventTitle}</p>
            <p className="event-map-time">{event.date},{event.time}</p>
            <p className="event-map-location">{event.eventLocation}</p>
            <p className="event-map-category">{event.eventCategory}</p>
            <p className="event-map-difficulty">{event.eventDifficulty}</p>
        </div>
        <div className="event-map-right">
            <p className="event-map-attendees">{event.eventAttendees.length} attendee(s)</p>
            <button className="join-event">Join</button>
        </div>
        </div>
    )
}
function eventsListCard(event){
    return (
        <div className="event-list-card">
        <div className="event-list-img">
        <div className="crop">
            <img src={event.eventImage}/>
        </div>
        </div>
        <div className="list-card-desc">
            <h1 className="event-list-name">{event.eventTitle}</h1>
            <p className="event-list-time">{event.date}, {event.time}</p>
            <p className="event-list-location">{event.eventLocation}</p>
            <p className="event-list-attendees">{event.eventAttendees.length} attendee(s)</p>

        </div>
        <div className="list-card-tags">
            <p className="event-list-category">{event.eventCategory}</p>
            <p className="event-list-difficulty">{event.eventDifficulty}</p>
        </div>
        <div>
            
            <button className="join-event-find">Join</button>
        </div>
        </div>
        
    )
}

function Searchbar({handleFilters, searchText}){
    return (
        <input 
        id="locationsearch"
        name="search"
        type="text"
        className="searchbar"
        placeholder={searchText}
        onChange={(e) => handleFilters(e)}
    />
    )
}
function EventMapHeader({eventsView,setEventsView}){
    function changeView(e){
        setEventsView(e.target.id);
          };
    return (
            <div style={{ display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                <h1 style={{marginTop:"0px", position:"relative", right:"140px"}}>Filters</h1>
                <h1 style={{marginTop:"0px", position:"relative", fontSize:"50px"}}>Search Events</h1>
                <div style={{marginTop:"0px", position:"relative", left:"250px"}}>
                <button id="mapview" style={{ fontWeight: eventsView === "mapview" ? "bold" : "" }} onClick={(e)=>changeView(e)}>Map View</button>
                <button id="listview" style={{ fontWeight: eventsView === "listview" ? "bold" : "" ,marginRight:"100px"}} onClick={(e)=>changeView(e)}>List View</button>
                </div>

            </div>

    )
}
function EventsMapList({events, handleFilters}){
    return (
        <div className="events-map-list">
            <Searchbar handleFilters={handleFilters} searchText="Search Location..."/>
            {
                events.map((event) => eventsMapCard(event))
            }
        </div>
    )
}
function EventsListList({events, handleFilters}){
    return (
        <div className="events-list-list">
            <div style={{ position: "relative", left:"-350px"}}>
            <Searchbar handleFilters={handleFilters}  searchText="Search Event..."/>
            </div>
            {
                events.map((event) => eventsListCard(event))
            }
        </div>
    )
}

export default function FindEventsMap(){
    const userId = useStoreState("userId");
    const [events, setEvents] = useState([]);
    const [groups, setGroups] = useState([]); // user's joined groups

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsRef = collection(firestore, "events");
            
            const q = query(eventsRef);
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
              console.log(querySnapshot);
              setEvents(fetchedEvents);
            }

          };
          const getGroupsJoined = async () => {
            const docRef = query(collection(firestore, "group"), where("groupmembers", "array-contains", userId));
            const docu = await getDocs(docRef);
            const updatedDocs = docu.docs.map(async (doc) => {
              return doc.data()['groupname'];
            });
            const updatedGroups = await Promise.all(updatedDocs);
            setGroups(updatedGroups);
          };

          fetchEvents();
          getGroupsJoined();
      }, []); // re-fetch the events whenever anything changes

console.log(groups);

/*
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
*/
    //const [events, setEvents] = useState(eventsdb);
    const [eventsView, setEventsView] = useState("mapview");
    const [filters, setFilters] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            search: "",
            difficulty: [],
            startDate: "",
            endDate: "",
            category: [],
            groups: []
        }
      );

    let filteredEvents = (filterEvents(events, filters, eventsView));

  

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

    function filterEvents(events, filters, eventsView){
        let filteredEvents = events.filter((event) => {
            if (filters.difficulty.length !==0 && !(filters.difficulty.includes(event.eventDifficulty))) return false;
            if (filters.category.length !==0 && !(filters.category.includes(event.eventCategory))) return false;
            if (filters.groups.length !==0 && !(filters.groups.includes(event.group))) return false;
            let eventDate = new Date(event.eventDate); 
            if (filters.startDate !== ""){
                let filterStartDate = new Date(filters.startDate);
                if (eventDate < filterStartDate) return false;
            }
            if (filters.endDate !== ""){
                let filterEndDate = new Date(filters.endDate);
                if (eventDate > filterEndDate) return false;
            }
            if (eventsView==="mapview") return event.eventLocation.toLowerCase().indexOf(filters.search.toLowerCase()) !==-1;
            return event.eventTitle.toLowerCase().indexOf(filters.search.toLowerCase()) !==-1;
        })
        return filteredEvents;
    }


    return(
        <div className="find-events-page" >{/*col*/}
            <EventMapHeader eventsView={eventsView} setEventsView={setEventsView} />{/*row*/}
            {eventsView==="mapview" ?
            (<EventMapInfo groups={groups} handleFilters={handleFilters} events={filteredEvents} eventsView={eventsView} setEventsView={setEventsView} />)
        : (<EventListInfo groups={groups} handleFilters={handleFilters} events={filteredEvents} eventsView={eventsView} setEventsView={setEventsView} />)}
        </div>

    )
}

function EventMapInfo({groups, handleFilters, events, eventsView, setEventsView}){
    return (
        <div className="event-map-info">
        <EventFilters groups={groups} handleFilters={handleFilters}/>
        <MapContainer />
        <EventsMapList events={events} eventsView={eventsView} setEventsView={setEventsView} handleFilters={handleFilters}/>    
    </div>
    )
}

function EventListInfo({groups, handleFilters, events, eventsView, setEventsView}){
    return (
        <div className="event-list-info">
        <EventFilters groups={groups} handleFilters={handleFilters}/>
        <EventsListList events={events} eventsView={eventsView} setEventsView={setEventsView} handleFilters={handleFilters}/>    
    </div>
    )
}