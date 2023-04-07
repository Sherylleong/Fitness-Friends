import { collection , doc, getDoc, getDocs, updateDoc, query, addDoc, where } from "firebase/firestore";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { firestore } from "../Components/FirebaseDb/Firebase";

export class GroupController {
    async createGroup(input) {
        return await addDoc(collection(firestore, "group"), input).then(()=> {
            return true;
        });
    }

    async updateGroup(groupId, input) {
        return await updateDoc(doc(firestore, "group", groupId), input).then(()=> {
            return true
        });
    }

    async getGroup(groupId, setPic, setGroupname, setGroupdesc, setDifficulty, setActivity) {
        const docRef = doc(firestore, "group", groupId);
        const docu = await getDoc(docRef);
        var d = docu.data();
        setPic(d.groupImageURL);
        setGroupname(d.groupname);
        setGroupdesc(d.groupdesc);
        setDifficulty(d.groupdifficulty);
        setActivity(d.groupcategory);
    }

    async getGroupDetails(groupId, userId, setGroup, setGroupEvents, setJoined) {
        const groupRef = doc(collection(firestore, "group"), groupId);
        const groupDoc = await getDoc(groupRef);
        if (groupDoc) {
            const data = groupDoc.data();
            if (data.groupmembers.includes(userId)) {
                setJoined(true);
            }
            setGroup(data);
        }

        const eventsRef = query(collection(firestore, "events"), where("groupId", "==", groupId));
        const eventDoc = await getDocs(eventsRef);
        var eventList = [];
        eventDoc.forEach((event) => {
            var newGroup = event.data();
            newGroup.id = event.data().id;

            eventList = [...eventList, newGroup];
        });
        setGroupEvents(eventList);
    }

    async joinGroup(group, setGroup, setJoined, groupId, userId) {
        var newGroup = group;
        const groupRef = doc(collection(firestore, "group"), groupId);
        if (group.groupmembers.includes(userId)) {
            // Leave Event, as already member of event
            await updateDoc(groupRef, {
                groupmembers: arrayRemove(userId),
            });
            var itemNo = newGroup.groupmembers.indexOf(userId);
            newGroup.groupmembers.splice(itemNo, 1);
            setGroup(newGroup);
            
            setJoined(false);
            console.log("successfully left");
        } else {
            // Join Event
            await updateDoc(groupRef, {
                groupmembers: arrayUnion(userId),
            });
            newGroup.groupmembers.push(userId);
            setGroup(newGroup);

            setJoined(true);
            console.log("successfully joined");
        }
    }

    async getAllGroups(setGroups) {
        const groupsRef = query(collection(firestore, "group"));
        const groupDocs = await getDocs(groupsRef);
        var fetchedGroups = [];
        groupDocs.forEach((group) => {
            var data = group.data();
            data.id = group.id;
            fetchedGroups = [...fetchedGroups, data];
        })
        setGroups(fetchedGroups);
    }

    async getAllUsers(setUsers) {
        const usersRef = query(collection(firestore, "users"));
        const userDocs = await getDocs(usersRef);
        var fetchedUsers = [];
        console.log(userDocs)
        userDocs.forEach((user) => {
            var data = user.data();
            data.id = user.id;
            fetchedUsers = [...fetchedUsers, data];
        })
        setUsers(fetchedUsers);
    }

    async getGroupMembers(groupId, setGroupMembersData) {
        const groupData = await getDoc(doc(firestore, "group", groupId)); // call the getByDocID function to retrieve data for the specified document ID
        if (groupData.exists()) {
            const q = query(collection(firestore, "users"), where("userId", "in", groupData.data().groupmembers));
            const querySnapshot = await getDocs(q);
            setGroupMembersData(querySnapshot.docs.map((doc) => doc.data()));
        }
    }
}   