import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Create.css";
import { useStoreState } from "../../App"
import { firestore, storage } from "../FirebaseDb/Firebase";
import { collection,doc, updateDoc ,getDocs, getDoc, query, limit, addDoc, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { GoogleMap, useLoadScript, Marker, MarkerClusterer, MarkerF } from "@react-google-maps/api";

export default function EditEvent() {
    const userId = useStoreState("userId");

	const [documentId, setDocumentId] = useState("");

	const [pic, setPic] = useState("");
	const [title, setTitle] = useState("");
    var today = new Date()

    var month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1)
    var hour = today.getHours() < 10 ? "0" + today.getHours()  : today.getHours()
    var day = today.getDate() < 10 ? "0" + (today.getDate()) : (today.getDate())
    var minutes = today.getMinutes() < 10 ? "0" + today.getMinutes()  : today.getMinutes()
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

    console.log(eventId);
    console.log(urlEventId);
    console.log(9990);
    const getEventDetails = async () => {
        const docRef = doc(firestore, "events", urlEventId);
        try {
            const docu = await getDoc(docRef);
            var d = docu.data();
            setPic(d.eventImage);
            setTitle(d.eventTitle);
            setEventDate(d.date);
            setEventTime(d.time);
            setBio(d.eventDescription);
            setDifficulty(d.eventDifficulty);
            setActivity(d.eventCategory);
            setSelected({
                name: d.eventLocation,
                position: d.eventPosition
            });
            const getGroupDocId = query(collection(firestore, "group"), where("groupId","==", d.groupId));
            try {
                const groupDocId = await getDocs(getGroupDocId);
                groupDocId.forEach((doc) => {
                    setGroupSelected(doc.id);
                });
            }catch(error) {
                console.log(error)
            }
        } catch(error) {
            console.log(error)
        }
    }

    const getUserGroup = async() => {
        const docRef = query(collection(firestore, "group"), where("groupOwner", "==", userId));
        const docu = await getDocs(docRef);
        var fetchGroup = [];
        docu.forEach((doc)=> {
            fetchGroup = [...fetchGroup, {
                // id: doc.data().groupId,
                id: doc.id,
                name: doc.data().groupname
            }]
        })
        setGroupList([...groupList, ...fetchGroup]);
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

	const uploadFile = async() => {
        if(userFile != null)  {
            const imageRef = ref(storage, urlEventId+"-eventpic");
            await uploadBytes(imageRef, userFile);

            getDownloadURL(imageRef).then((url)=> {
                updateEvent(url);
            });
        }else {
            updateEvent(pic);
        }
    }

    const updateEvent = (url) => {
        var eventType = "individual";
        if (groupSelected != "") {
            eventType = "group";
        }
        updateDoc(doc(firestore, 'events',urlEventId), {
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
            eventTitle: title,
            eventDescription: bio,
            eventType: eventType,
            groupId: groupSelected,
            eventImage: url
        }).then(navigate("/ViewProfile"))

 
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

        if (!incorrect) {uploadFile(); alert("Event successfully edited!")}
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
                                </div>
                                <div>
                                <b>Time of Event </b>
                                <input className="input-ignore-width" type="time" value={eventTime} onChange={(e)=>setEventTime(e.target.value)}></input>
                                <div style={{display: eventTime ? 'none' : 'block'}} id="missing-time" className="account-form-incorrect">Event time is required.</div>
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

