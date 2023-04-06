import { addDoc } from "firebase/firestore";
import { firestore } from "../Components/FirebaseDb/Firebase";

export class EventController {
    async getUserJoinedEvents(userId,joinState, attendedState) {
        
    }

    async getUserCreatedEvents(userId,joinState, attendedState) {

    }

    async getEventDetails(eventId) {
        
    }

    async createEvent(userId, url, title, description, eventDate, eventTime, eventActivity, location, position, group) {
        var rtnVal;
        if (group == "") {
            var eventType = "group";
            return await addDoc(collection(firestore, 'events'), {
                creatorID: userId,
                date: eventDate,
                time: eventTime,
                eventDifficulty: difficulty,
                eventCategory: eventActivity,
                eventLocation: location,
                eventAttendees:[],
                eventPosition: position,
                eventTitle: title,
                eventDescription: description,
                eventType: eventType,
                groupId: groupSelected,
                eventImage: url
            }).then(()=> {
                return true;
            });
        }else {
            var eventType = "individual";
            return await addDoc(collection(firestore, 'events'), {
                creatorID: userId,
                date: eventDate,
                time: eventTime,
                eventDifficulty: difficulty,
                eventCategory: eventActivity,
                eventLocation: location,
                eventAttendees:[],
                eventPosition: position,
                eventTitle: title,
                eventDescription: description,
                eventType: eventType,
                groupId: groupSelected,
                eventImage: url
            }).then(()=> {
                return true;
            });
        }
    }
}