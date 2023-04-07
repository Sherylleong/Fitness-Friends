import { collection , doc, getDoc, getDocs, updateDoc, query, addDoc, where } from "firebase/firestore";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { firestore } from "../Components/FirebaseDb/Firebase";
import EventFilters from "../Components/Filters/EventFilters";

export class EventController {
    constructor() {
        this.today = new Date();
        this.today.setHours(0, 0, 0, 0);
    }

    async createEvent(input) {
        return await addDoc(collection(firestore, 'events'), input).then(()=> {
            return true;
        });
    }

    async getEvent(eventId, setPic, setTitle, setEventDate, setEventTime, setBio, setDifficulty, setActivity, setSelected, setGroupSelected) {
        const docRef = doc(firestore, "events", eventId);
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
        if (d.eventType == "group") {
            setGroupSelected(d.groupId);
        }
    }

    async updateEvent(eventId, input) {
        return await updateDoc(doc(firestore, 'events', eventId), input).then(()=> {
            return true;
        });
    }

    async getEventDetails(eventId, userId, setEvent, setEventOver, setJoined) {
        const eventRef = doc(collection(firestore, "events"), eventId);
        const eventDoc = await getDoc(eventRef);
        if (eventDoc) {
            const data = eventDoc.data();
            if (new Date(data.date) < this.today) {
                setEventOver(true);
            }
            if (data.eventAttendees.includes(userId)) {
                setJoined(true);
            }
            setEvent(data);
        }
    }

    // Used to Join/Leave(if already joined) Events
    async joinEvent(event, setEvent, setJoined, eventId, userId) {
        var newEvent = event;
        const eventRef = doc(collection(firestore, "events"), eventId);
        if (event.eventAttendees.includes(userId)) {
            // Leave Event, as already member of event
            await updateDoc(eventRef, {
              eventAttendees: arrayRemove(userId),
            });
            var itemNo = newEvent.eventAttendees.indexOf(userId);
            newEvent.eventAttendees.splice(itemNo, 1);
            setEvent(newEvent);
            
            setJoined(false);
            console.log("successfully left");
        } else {
            // Join Event
            await updateDoc(eventRef, {
                eventAttendees: arrayUnion(userId),
            });
            newEvent.eventAttendees.push(userId);
            setEvent(newEvent);

            setJoined(true);
            console.log("successfully joined");
        }
    }

    async getAllEvents(setEvents) {
        const eventsRef = query(collection(firestore, "events"));
        const eventDocs = await getDocs(eventsRef);
        var fetchedEvents = [];
        eventDocs.forEach((event) => {
            var data = event.data();
            data.id = event.id;
            fetchedEvents = [...fetchedEvents, data];
        })
        setEvents(fetchedEvents);
    }
    
    async getUserGroups(userId, setGroups) {
        const docRef = query(collection(firestore, "group"),where("groupmembers", "array-contains", userId));
        const docu = await getDocs(docRef);
        const updatedDocs = docu.docs.map(async (doc) => {
            return { id: doc.id, groupname: doc.data()["groupname"] };
        });
        const fetchedGroups = await Promise.all(updatedDocs); // jank, has to be an easier way :(
        let updatedGroups = {};
        fetchedGroups.forEach((group) => {
            updatedGroups[group.id] = group.groupname;
        });
        setGroups({...updatedGroups});
    }

    async getParkLocations() {
        const docRef = query(collection(firestore, "locations"));
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
		});
        console.log(mapArr);
        return mapArr;
    }

    async getEventMembers(eventId, setEventMembersData) {
        const eventData = await getDoc(doc(firestore, "events", eventId)); // call the getByDocID function to retrieve data for the specified document ID
        if (eventData.exists()) {
            const q = query(collection(firestore, "users"), where("userId", "in", eventData.data().eventAttendees));
            const querySnapshot = await getDocs(q);
            setEventMembersData(querySnapshot.docs.map((doc) => doc.data()));
        }
    }
}