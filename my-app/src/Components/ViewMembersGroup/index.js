import { useState, useEffect } from "react";
import { collection, doc, getDocs, query, where,getDoc} from "firebase/firestore";
import { firestore } from "../FirebaseDb/Firebase";
import 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import"./ViewMembers.css";
function ViewMembersGroup() {
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
    const { groupId: urlgroupId } = useParams(); // retrieve the groupId from the URL parameter
    const [groupId, setgroupId] = useState(null); // add a state variable for groupId\
    useEffect(() => {
        setgroupId(urlgroupId);
    }, [urlgroupId]);

    // fetch groupAttendees from firestore using getByDocID function where groupAttendees is an array in the group
    const [groupMembers, setgroupMembers] = useState([]);
    useEffect(() => {
        const fetchgroupMembers = async () => {
            const groupDocId = groupId; // use groupId as the document ID to fetch data for
            const groupData = await getByDocID("group", groupDocId); // call the getByDocID function to retrieve data for the specified document ID
            if (groupData) {
                console.log(groupData);
                setgroupMembers(groupData.groupmembers); // set the groupAttendees state to the retrieved data
            }
        };
        fetchgroupMembers();
    }, [groupId]);
    // groupAttendees is an array of userIDs. Use this array to fetch user data from firestore where userID is the userId field in the users collection
    const [groupMembersData, setgroupMembersData] = useState([]);
    useEffect(() => {
        const fetchgroupMembersData = async () => {
            //fetch all user data from firestore using the groupAttendees array with a query
            const q = query(collection(firestore, "users"), where("userId", "in", groupMembers));
            const querySnapshot = await getDocs(q);
            setgroupMembersData(querySnapshot.docs.map((doc) => doc.data()));
        };
        fetchgroupMembersData();
    }, [groupMembers]);
    
    console.log("groupId")
    console.log(groupId);
    console.log("groupMembers")
    console.log(groupMembers);
    console.log("groupMembersData")
    console.log(groupMembersData);
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