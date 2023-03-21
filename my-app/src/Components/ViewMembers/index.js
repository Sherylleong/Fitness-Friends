import { useState, useEffect } from "react";
import 'firebase/firestore';
import { useNavigate } from "react-router-dom";
function ViewMembers() {
    const { eventId: urlEventId } = useParams(); // retrieve the EventId from the URL parameter
    const [eventId, setEventId] = useState(null); // add a state variable for EventId\
    useEffect(() => {
        setEventId(urlEventId);
    }, [urlEventId]);
    const [members, setMembers] = useState([]);
    //fetch members from firestore where eventid is the docid of the event and members is an array called eventAttendees inside of the doc
    useEffect(() => {
        const fetchMembers = async () => {
            const eventDocId = eventId; // use eventId as the document ID to fetch data for
            const eventData = await getByDocID("events", eventDocId); // call the getByDocID function to retrieve data for the specified document ID
            if (eventData) {
                console.log(eventData);
                setMembers(eventData.eventAttendees); // set the members state to the retrieved data
            }
        };
        fetchMembers();
    }, [eventId]);
    console.log(members);
    return (
        <div className="ViewMembersFull">
            <button className="ViewMembersBackButton">&lt; Back</button>
        </div>
    )
}
export default ViewMembers;