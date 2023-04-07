import { useState, useEffect } from "react";
import 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./ViewMembers.css";
import { EventController } from "../../Controller/EventController";

function ViewMembersEvent() {
    const { eventId: urlEventId } = useParams(); // retrieve the EventId from the URL parameter
    const ec = new EventController();
    const [eventAttendeesData, setEventAttendeesData] = useState([]);

    useEffect(() => {
        ec.getEventMembers(urlEventId, setEventAttendeesData);
    }, [urlEventId]);

    const navigate = useNavigate();
    const handleViewMemberReturn = () => {
        navigate(-1);
    };
    

    const handleViewMemberProfile = (memberId) => {
        console.log(memberId);  
        navigate("/ViewMemberProfile/" + memberId);
    };
    return (
        <div className="ViewMembersFull">
            <button className="ViewMembersBackButton" onClick={handleViewMemberReturn}>&lt; Back</button>
            <div className="ViewMembersTitle">Members</div>
            {/*eventAttendeesData is an array of arrays, display each entry's profilePic and displayName*/}
            {eventAttendeesData.map((eventAttendeeData) => (
                <div className="ViewMemberCard" onClick={()=>handleViewMemberProfile(eventAttendeeData.userId)}>
                    <div className="ViewMemberPFPContainer"><img className="ViewMemberCardProfilePic" src={eventAttendeeData.profilePic} alt="Profile Pic" /></div>
                    <div className="ViewMemberDisplayNameContainer"><div className="ViewMemberCardDisplayName">{eventAttendeeData.displayName}</div></div>
                </div>
            ))}
        </div>
    )
}
export default ViewMembersEvent;