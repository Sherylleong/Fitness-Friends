import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStoreState } from "../../App"
import "../Create.css";

import { firestore, storage } from "../FirebaseDb/Firebase";
import { collection,doc, updateDoc ,getDocs, getDoc, query, limit, addDoc, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { GoogleMap, useLoadScript, Marker, MarkerClusterer, MarkerF } from "@react-google-maps/api";

export default function EditEvent() {
    // const userId = useStoreState("userId");
    const userId = "ha"
	const [documentId, setDocumentId] = useState("");

	const [pic, setPic] = useState("");
	const [title, setTitle] = useState("");
    var today = new Date()
    var month = today.getMonth() < 10 ? "0" + today.getMonth() : today.getMonth()
	const [eventDate, setEventDate] = useState("");
    var hour = today.getHours() < 10 ? "0" + today.getHours()  : today.getHours()
    var minutes = today.getMinutes() < 10 ? "0" + today.getMinutes()  : today.getMinutes()
    const [eventTime, setEventTime] = useState("");
	const [bio, setBio] = useState("");
    const [difficulty, setDifficulty] = useState("")
    const [eventActivity, setActivity] = useState("")

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

    const { eventId: urlEventId } = useParams();


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
        updateDoc(collection(firestore, 'events',urlEventId), {
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
        });
    }

    const removeImage = () => {
        setUserFile(null);
		setPic("https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c");
	}

    function createEventClick() {
        uploadFile();
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
                                <div>
                                <b>Select Group</b>
                                <select value={groupSelected} onChange={(e)=>setGroupSelected(e.target.value)}>
								    {groupList.map(item=> <option value={item.id}>{item.name}</option>)}
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
                        <button onClick={()=>createEventClick()}>Save Changes</button>
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

