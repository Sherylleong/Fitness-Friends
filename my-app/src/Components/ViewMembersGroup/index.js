import { useState, useEffect } from "react";
import { collection, doc, getDocs, query, where,getDoc} from "firebase/firestore";
import { firestore } from "../FirebaseDb/Firebase";
import 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import"./ViewMembers.css";
import { GroupController } from "../../Controller/GroupController";
function ViewMembersGroup() {
    const [groupMembersData, setgroupMembersData] = useState([]);
    const gc = new GroupController();

    const { groupId: urlgroupId } = useParams(); // retrieve the groupId from the URL parameter
    useEffect(() => {
        gc.getGroupMembers(urlgroupId,setgroupMembersData);
    }, [urlgroupId]);
    
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
            {/*groupMembersData is an array of arrays, display each entry's profilePic and displayName*/}
            {groupMembersData.map((groupMembersData) => (
                <div className="ViewMemberCard" onClick={()=>handleViewMemberProfile(groupMembersData.userId)}>
                    
                    <div className="ViewMemberPFPContainer">
                        <img className="ViewMemberCardProfilePic" src={groupMembersData.profilePic} alt="Profile Pic" />
                    </div>
                    <div className="ViewMemberDisplayNameContainer">
                        <div className="ViewMemberCardDisplayName">{groupMembersData.displayName}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}
export default ViewMembersGroup;