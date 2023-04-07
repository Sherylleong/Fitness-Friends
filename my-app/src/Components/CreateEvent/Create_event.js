import { useEffect, useState } from "react";
import { useStoreState } from "../../App"
import "../Create.css";
import Filter from 'bad-words';
import { firestore, storage } from "../FirebaseDb/Firebase";
import { collection ,getDocs, query, limit, addDoc, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { GoogleMap, useLoadScript, Marker, MarkerClusterer, MarkerF } from "@react-google-maps/api";
import { useMemo } from "react";
import { render } from "@testing-library/react";
import { EventController } from "../../Controller/EventController";
import { ImageController} from "../../Controller/ImageController";
import { UserController } from "../../Controller/UserController";

export default function CreateEvent() {
    const navigate = useNavigate();
    const userId = useStoreState("userId");
	const [documentId, setDocumentId] = useState("");
    const ec = new EventController();
	const [pic, setPic] = useState("https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c");
	const [title, setTitle] = useState("");

    // Calculate Date and Time
    var today = new Date()

    var month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1)
    var hour = today.getHours() < 10 ? "0" + today.getHours()  : today.getHours()
    var day = today.getDate() < 10 ? "0" + (today.getDate()) : (today.getDate())
    var minutes = today.getMinutes() < 10 ? "0" + today.getMinutes()  : today.getMinutes()
    var min = (today.getFullYear() + "-" + month + "-" + day);

    const [eventDate, setEventDate] = useState(min);

    const [eventTime, setEventTime] = useState(hour + ":" + minutes);
	const [bio, setBio] = useState("");
    const [difficulty, setDifficulty] = useState("Beginner");
    const [eventActivity, setActivity] = useState("Walking");


    const difficultyChoices = ["Beginner", "Intermediate", "Advanced"]
    const activityChoices = ["Walking", "Jogging", "Running", "Climbing","Biking","Sports","Others"]

    const [selected, setSelected] = useState({
        name:"",
        position: {lat:1.3573334951328686,lng:103.80911341579483}
    });
    const [filterValue, setFilterValue] = useState("");

    const eventId = uuidv4();

    const [mapData, setMapData] = useState([]);
    const [filterMapData, setFilterMapData] = useState([]);
    const [groupList, setGroupList] = useState([{
        id:"",
        name:"None"
    }]);
    const [groupSelected, setGroupSelected] = useState("");

    const [showMissingTitle, setShowMissingTitle] = useState(false);
    const [showMissingDesc, setShowMissingDesc] = useState(false);
    const [showMissingLocation, setShowMissingLocation] = useState(false);
    const [showInvalidDateTime, setShowInvalidDateTime] = useState(false);
  
    
    const getUserGroup = async() => {
        const uc = new UserController();
        var fetchGroup = await uc.getGroups(userId);
        setGroupList([...groupList, ...fetchGroup]);
    }

    const getMarkerLoc = async () => {
        var mapData = await ec.getParkLocations();
        console.log(mapData);
        setMapData(mapData);
        setFilterMapData(mapData);
    }

    const changeFilter = (e) => {
        setFilterValue(e.target.value);
        var arr = []
        arr = filterByLocation(mapData, e.target.value)
        setFilterMapData(arr);
    }

    const filterByLocation = (arr, searchParams) => {
        return arr.filter(({name}) => {
            const location = name.toLowerCase();
                return location.includes(searchParams.toLowerCase());
              })
    }

    const [userFile, setUserFile] = useState(null);
	const acceptFile = event => {
		var fileUploaded = event.target.files[0];
		setUserFile(fileUploaded);
		setPic(URL.createObjectURL(fileUploaded));
	};

	const createEvent = async() => {
        var url
        if (userFile != null) {
            const ic = new ImageController();
            url = await ic.uploadFile(userFile, eventId, "event");
        }else {
            url = pic;
        }
        const badFilter = new Filter();
        let nameChange=title, descChange=bio;
		try {nameChange = badFilter.clean(title)} catch(e) {}
		try {descChange = badFilter.clean(bio)} catch(e) {}
        var eventType = "individual";
        if (groupSelected != "") {
            eventType = "group";
        }
        await ec.createEvent({
            creatorID: userId,
            date: eventDate,
            time: eventTime,
            eventDifficulty: difficulty,
            eventCategory: eventActivity,
            eventLocation: selected.name,
            eventAttendees:[],
            eventPosition: {
                lat: selected.position.lat,
                lng: selected.position.lng
            },
            eventTitle: nameChange,
            eventDescription: descChange,
            eventType: eventType,
            groupId: groupSelected,
            eventImage: url
        });
        navigate("/ViewProfile");
    }

    const removeImage = () => {
        setUserFile(null);
		setPic("https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c");
	}

    function createEventClick() {
        let incorrect = false;
        setShowMissingTitle(false);
        setShowMissingDesc(false);
        setShowMissingLocation(false);
        setShowInvalidDateTime(false);
        if (!title) {
            setShowMissingTitle(true);
            incorrect = true;
        }
        if (!bio) {
            setShowMissingDesc(true);  
            incorrect = true;}
        if (!(selected.name)) {
            setShowMissingLocation(true);  
            incorrect = true;
        }
        if (!(eventDate)) {
            incorrect = true;
        }
        if (!(eventTime)) {
            incorrect = true;
        }
        let chosenDate = new Date(eventDate + ' ' + eventTime);
        let chosenYear = eventDate.substring(0,4);

        if ((Number(chosenYear)< 2023) || chosenDate.getTime() < new Date().getTime()) {
            setShowInvalidDateTime(true);
            incorrect=true;
        }
        if (!incorrect) {createEvent(); alert("Event successfully created!")}
    }


    useEffect(() => {
		getMarkerLoc();
        getUserGroup();
	  }, []);

    return (
        <div className="createDiv">
            <div className ="header">
                <h1>Create Event</h1>
                <p><b></b></p>
            </div>
            <div className="body">
                <div className="left-div">
                    <div className="button-align-center">
                        <img className="editprofile-img" src={pic}/>
                        <label className="button-upload-file">Change Image
                            <input type="file" accept="image/png, image/jpeg" onChange={acceptFile}></input>
                        </label>
                        <button className="dull-button" onClick={()=>removeImage()}>Remove Image</button>
                    </div>
                    <div className="form-items">
                        <form>
                            <b>Title</b>
                            <input lassName="default-input" type="text" value={title} onChange={(e)=>setTitle(e.target.value)}></input>
                            <div style={{display: showMissingTitle ? 'block' : 'none'}} id="missing-title" className="account-form-incorrect">Event title is required.</div>

                            <div className="user-inputs">
                                <div>
                                <b>Date of Event </b>
                                <input className="input-ignore-width" type="date" min={min} value={eventDate} onChange={(e)=>setEventDate(e.target.value)}></input>
                                <div style={{display: eventDate ? 'none' : 'block'}} id="missing-date" className="account-form-incorrect">Event date is required.</div>
                                <div style={{display: showInvalidDateTime ? 'block' : 'none'}} id="invalid-time" className="account-form-incorrect">Valid date and time is required.</div>
                                </div>
                                <div>
                                <b>Time of Event </b>
                                <input className="input-ignore-width" type="time" value={eventTime} onChange={(e)=>setEventTime(e.target.value)}></input>
                                <div style={{display: eventTime ? 'none' : 'block'}} id="missing-time" className="account-form-incorrect">Event time is required.</div>
                                <div style={{display: showInvalidDateTime ? 'block' : 'none'}} id="invalid-time" className="account-form-incorrect">Valid date and time is required.</div>
                                </div>
                                
                            </div>
                            <div className="user-inputs">
                                <div>
                                <b>Select Event Difficulty</b>
                                <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
								    {difficultyChoices.map(item=> <option value={item}>{item}</option>)}
							    </select>
                                </div>
                                <div>
                                <b>Select Event Activitiy</b>
                                <select value={eventActivity} onChange={(e)=>setActivity(e.target.value)}>
								    {activityChoices.map(item=> <option value={item}>{item}</option>)}
							    </select>
                                </div>
                                <div>
                                <b>Select Group</b>
                                <select value={groupSelected} onChange={(e)=>setGroupSelected(e.target.value)}>
								    {groupList.map(item=> <option value={item.id}>{item.name}</option>)}
							    </select>
                                </div>
                            </div>
                            <b>Event Description</b>
                            <textarea className="bio-input" value={bio} onChange={(e)=>setBio(e.target.value)}></textarea>
                            <div style={{display: showMissingDesc ? 'block' : 'none'}} id="missing-desc" className="account-form-incorrect">Event description is required.</div>
                        </form>
                    </div>
                </div>
                <div className="right-div">
                    <div className="map-select">
                        <b>Selected Location</b>
                        <p className="dropdown-select">{selected.name ? selected.name : "None"}</p>
                        <div style={{display: showMissingLocation ? 'block' : 'none'}} id="missing-location" className="account-form-incorrect">Location selection is required.</div>
                        <div className="map-contain">
                            <MapContainer state={selected} setState={setSelected} mapData={mapData}/>
                            <div className="search-location">
                                <input className="create-searchbar" type="text" value={filterValue} placeholder="Search Location..."  onChange={(e)=>changeFilter(e)}></input>
                                <div className="location-list">
                                    {filterMapData.map(data=> <div className="location-item" onClick={()=>setSelected(data)}>{data.name}</div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="button-align-from-left">
                        <button onClick={()=>createEventClick()}>Create Event</button>
                        <button className="dull-button" onClick={()=>{navigate("/ViewProfile")}}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MapContainer({state, setState, mapData}) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyCGCznAwZAFJ8qMQY1ckg6EfDwuczmepWI",
    });
    if (!isLoaded) return <div>..Loading</div>;
    return <EventMap state={state} setState={setState} mapData={mapData}/>;
}


function EventMap({state, setState, mapData}) {
    const [zoom, setZoom] = useState(12)
    const onMarkerClick = (event) => {
        console.log(event);
        setState(event);
        setZoom(16)
    }

    return (
        <>
          <GoogleMap
            zoom={zoom}
            center={state.position}
            mapContainerClassName="event-map">
                <MarkerClusterer>
                {clusterer => 
                    mapData.map((marker, index) => (
                        <Marker key={"marker-" + index} id={index} position={marker.position} clusterer={clusterer} onClick={()=>onMarkerClick(marker)}/>
                    ))
                }
                </MarkerClusterer>
          </GoogleMap>
        </>
      );
}