import { useEffect, useState } from "react";
import { useStoreState } from "../../App"
import "../Create.css";

import { firestore, storage } from "../FirebaseDb/Firebase";
import { collection,doc, updateDoc ,getDocs, query, limit, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { GoogleMap, useLoadScript, Marker, MarkerClusterer, MarkerF } from "@react-google-maps/api";
import { useMemo } from "react";
import { render } from "@testing-library/react";

export default function CreateEvent() {
    // const userId = useStoreState("userId");
    const userId = "ha"
	const [documentId, setDocumentId] = useState("");

	const [pic, setPic] = useState("https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c");
	const [title, setTitle] = useState("");
    var today = new Date()
    var month = today.getMonth() < 10 ? "0" + today.getMonth() : today.getMonth()
	const [eventDate, setEventDate] = useState(today.getFullYear() + "-" + month + "-" + today.getDate());
    var hour = today.getHours() < 10 ? "0" + today.getHours()  : today.getHours()
    var minutes = today.getMinutes() < 10 ? "0" + today.getMinutes()  : today.getMinutes()
    const [eventTime, setEventTime] = useState(hour + ":" + minutes);
	const [bio, setBio] = useState("");
    const [difficulty, setDifficulty] = useState("Beginner")
    const [eventActivity, setActivity] = useState("Walking")

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
            // setMapData(oldMapData => [...oldMapData, {
            //     name: doc.data().name,
            //     position: {
            //         lat: doc.data().x,
            //         lng: doc.data().y
            //     }
            // }]);
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

	const uploadFile = async() => {
		const imageRef = ref(storage, eventId+"-eventpic");
		await uploadBytes(imageRef, userFile);

		getDownloadURL(imageRef).then((url)=> {
            
            addDoc(collection(firestore, 'event'), {
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
                eventTitle: title,
                eventDescription: bio,
                eventType: "individual",
                eventImage: url
            });
        });
    }


    const removeImage = () => {
		setPic("https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c");
	}

    function createEventClick() {
        uploadFile();
    }


    useEffect(() => {
		getMarkerLoc();
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
                            <div className="user-inputs">
                                <div>
                                <b>Date of Event </b>
                                <input className="input-ignore-width" type="date" value={eventDate} onChange={(e)=>setEventDate(e.target.value)}></input>
                                </div>
                                <div>
                                <b>Time of Event </b>
                                <input className="input-ignore-width" type="time" value={eventTime} onChange={(e)=>setEventTime(e.target.value)}></input>
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
                            </div>
                            <b>Event Description</b>
                            <textarea className="bio-input" value={bio} onChange={(e)=>setBio(e.target.value)}></textarea>
                        </form>
                    </div>
                </div>
                <div className="right-div">
                    <div className="map-select">
                        <b>Selected Location</b>
                        <p>{selected.name}</p>
                        <div className="map-contain">
                            <MapContainer state={selected} setState={setSelected} mapData={mapData}/>
                            <div className="search-location">
                                <input type="text" value={filterValue} onChange={(e)=>changeFilter(e)}></input>
                                <div className="location-list">
                                    {filterMapData.map(data=> <div onClick={()=>setSelected(data)}>{data.name}</div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="button-align-from-left">
                        <button onClick={()=>createEventClick()}>Create Event</button>
                        <button className="dull-button" onClick={()=>{}}>Cancel</button>
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
        console.log(event);
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