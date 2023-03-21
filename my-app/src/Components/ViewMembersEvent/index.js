import { useState, useEffect } from "react";
import { collection, doc, getDocs, query, where,getDoc} from "firebase/firestore";
import { firestore } from "../FirebaseDb/Firebase";
import 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import"./ViewMembers.css";
function ViewMembersEvent() {
    const getByDocID = async (collectionName, docID) => {
        const docRef = doc(firestore, collectionName, docID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          console.log("Document does not exist");
          return null;
        }
      };
    const { eventId: urlEventId } = useParams(); // retrieve the EventId from the URL parameter
    const [eventId, setEventId] = useState(null); // add a state variable for EventId\
    useEffect(() => {
        setEventId(urlEventId);
    }, [urlEventId]);

    // fetch eventAttendees from firestore using getByDocID function where eventAttendees is an array in the event
    const [eventAttendees, setEventAttendees] = useState([]);
    useEffect(() => {
        const fetchEventAttendees = async () => {
            const eventDocId = eventId; // use eventId as the document ID to fetch data for
            const eventData = await getByDocID("events", eventDocId); // call the getByDocID function to retrieve data for the specified document ID
            if (eventData) {
                console.log(eventData);
                setEventAttendees(eventData.eventAttendees); // set the eventAttendees state to the retrieved data
            }
        };
        fetchEventAttendees();
    }, [eventId]);
    // eventAttendees is an array of userIDs. Use this array to fetch user data from firestore where userID is the userId field in the users collection
    const [eventAttendeesData, setEventAttendeesData] = useState([]);
    useEffect(() => {
        const fetchEventAttendeesData = async () => {
            //fetch all user data from firestore using the eventAttendees array with a query
            const q = query(collection(firestore, "users"), where("userId", "in", eventAttendees));
            const querySnapshot = await getDocs(q);
            setEventAttendeesData(querySnapshot.docs.map((doc) => doc.data()));
        };
        fetchEventAttendeesData();
    }, [eventAttendees]);
    console.log("eventAttendeesData")
    console.log(eventAttendeesData);
    console.log("eventID")
    console.log(eventId);
    console.log("eventAttendees")
    console.log(eventAttendees);
    const navigate = useNavigate();
    const handleViewMemberReturn = () => {
        navigate(-1);
      };
    return (
        <div className="ViewMembersFull">
            <button className="ViewMembersBackButton" onClick={handleViewMemberReturn}>&lt; Back</button>
            <div className="ViewMembersTitle">Members</div>
            {/*eventAttendeesData is an array of arrays, display each entry's profilePic and displayName*/}
            {eventAttendeesData.map((eventAttendeeData) => (
                <div className="ViewMemberCard" key={eventAttendeeData.userId}>
                    <div className="ViewMemberPFPContainer"><img className="ViewMemberCardProfilePic" src={eventAttendeeData.profilePic} alt="Profile Pic" /></div>
                    <div className="ViewMemberDisplayNameContainer"><div className="ViewMemberCardDisplayName">{eventAttendeeData.displayName}</div></div>
                </div>
            ))}
        </div>
    )
}
export default ViewMembersEvent;