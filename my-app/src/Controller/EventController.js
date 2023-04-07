import { collection , doc, getDoc, getDocs, updateDoc, query, addDoc, where } from "firebase/firestore";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { firestore } from "../Components/FirebaseDb/Firebase";
import EventFilters from "../Components/Filters/EventFilters";

export class EventController {
    constructor() {
        this.today = new Date();
        this.today.setHours(0, 0, 0, 0);
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

    async createEvent(input) {
        return await addDoc(collection(firestore, 'events'), input).then(()=> {
            return true;
        });
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