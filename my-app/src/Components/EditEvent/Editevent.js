import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Create.css";
import { useStoreState } from "../../App"
import { firestore } from "../FirebaseDb/Firebase";
import { collection,getDocs, limit } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Filter from 'bad-words';
import { GoogleMap, useLoadScript, Marker, MarkerClusterer } from "@react-google-maps/api";
import { EventController } from "../../Controller/EventController";
import { UserController } from "../../Controller/UserController";
import { ImageController } from "../../Controller/ImageController";

export default function EditEvent() {
    const userId = useStoreState("userId");
	const [pic, setPic] = useState("");
	const [title, setTitle] = useState("");
    var today = new Date()

    var month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1)
    var day = today.getDate() < 10 ? "0" + (today.getDate()) : (today.getDate())
    var min = (today.getFullYear() + "-" + month + "-" + day);

    const [eventDate, setEventDate] = useState(min);
    const [eventTime, setEventTime] = useState("");
	const [bio, setBio] = useState("");
    const [difficulty, setDifficulty] = useState("")
    const [eventActivity, setActivity] = useState("")

    const navigate = useNavigate();

    const difficultyChoices = ["Beginner", "Intermediate", "Advanced"]
    const activityChoices = ["Walking", "Jogging", "Running", "Climbing","Biking","Sports","Others"]

    const [selected, setSelected] = useState({
        name:"",
        position: {lat: 1.348578045634617,
        lng: 103.6831722481014}
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
    const { eventId: urlEventId } = useParams();
    const [showInvalidDateTime, setShowInvalidDateTime] = useState(false);

    const ec = new EventController();
    const uc= new UserController();
    const getEventDetails = async () => {
        ec.getEvent(urlEventId, setPic, setTitle, setEventDate, setEventTime, setBio, 
            setDifficulty, setActivity, setSelected, setGroupSelected);
    }

    const getUserGroup = async() => {
        uc.getGroupsOwned(userId, setGroupList);
    }

    const getMarkerLoc = async () => {
        const docRef = query(collection(firestore, "locations"), limit(15));
		const docu = await getDocs(docRef);
        var mapArr = [];
		docu.forEach((doc) => {
            mapArr.push({
                name: doc.data().name,
                position: {
                    lat: doc.data().x,
                    lng: doc.data().y
                }
            });
            setMapData(mapArr);
            setFilterMapData(mapArr);
		});
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

    const updateEvent = async () => {
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
        await ec.updateEvent(urlEventId, {
            creatorID: userId,
            date: eventDate,
            time: eventTime,
            eventDifficulty: difficulty,
            eventCategory: eventActivity,
            eventLocation: selected.name,
            eventPosition: {
                lat: selected.position.lat,
                lng: selected.position.lng
            },
            eventTitle: nameChange,
            eventDescription: descChange,
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
        if (!incorrect) {updateEvent(); alert("Event successfully edited!")}
    }


    useEffect(() => {
        getEventDetails();
		getMarkerLoc();
        getUserGroup();
	  }, []);

    return (
        <div className="createDiv">
            <div className ="header">
                <h1>Edit Event</h1>
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
                                <select disabled value={groupSelected} onChange={(e)=>setGroupSelected(e.target.value)}>
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
                        <p>{selected.name}</p>
                        <div style={{display: showMissingLocation ? 'block' : 'none'}} id="missing-location" className="account-form-incorrect">Location selection is required.</div>
                        <div className="map-contain">
                            <MapContainer state={selected} setState={setSelected} mapData={mapData}/>
                            <div className="search-location">
                            <input className="create-searchbar" type="text" value={filterValue} placeholder="Search Location..." onChange={(e)=>changeFilter(e)}></input>
                                <div className="location-list">
                                {filterMapData.map(data=> <div className="location-item" onClick={()=>setSelected(data)}>{data.name}</div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="button-align-from-left">
                        <button onClick={()=>createEventClick()}>Save Changes</button>
                        <button className="dull-button" onClick={()=>{navigate("/ViewProfile");}}>Cancel</button>
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
    const [zoom, setZoom] = useState(18)
    const onMarkerClick = (event) => {

        setState(event);
        setZoom(14)
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

