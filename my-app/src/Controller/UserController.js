import { firestore,  } from "../Components/FirebaseDb/Firebase";
import { collection , doc, getDocs, updateDoc, query, where } from "firebase/firestore";

export class UserController {
    constructor() {
        this.today = new Date();
        this.today.setHours(0,0,0,0);
    }

    async getProfile(userId, setDocumentId, setProfilePic, setBio, setDisplayName,setLocation,setGroupJoined,setEventAttending,setEventAttended) {
        const docRef = query(collection(firestore, "users"), where("userId", "==", userId));
		const docu = await getDocs(docRef);
		docu.forEach((doc) => {
			setDocumentId(doc.id);
			var userData = doc.data();
			setProfilePic(userData.profilePic);
			setBio(userData.Bio);
			setDisplayName(userData.displayName);
			setLocation(userData.Location);
			var settings = userData.settings;
			setGroupJoined(settings.groupJoined == true);
			setEventAttending(settings.eventAttending == true);
			setEventAttended(settings.eventAttended == true);
		});
    }

    async updateProfile(userId, input) {
        return await updateDoc(doc(firestore, 'users', userId), input).then(()=> {
            return true;
        });
    }

    // Returns list of group names that user has created
    async getGroupsOwned(userId, setGroups) {
        const docRef = query(collection(firestore, "group"), where("groupOwner", "==", userId));
        const docu = await getDocs(docRef);
        var fetchGroup = [{id: "", name:"None"}];
        docu.forEach((doc)=> {
            fetchGroup = [...fetchGroup, {
                id: doc.id,
                name: doc.data().groupname
            }]
        })
        setGroups(fetchGroup);
    }

    async getProfileDetails(userId, setState) {
        const docRef = query(collection(firestore, "users"),where("userId", "==", userId));
        const docu = await getDocs(docRef);
        await docu.forEach((doc) => {
            setState(doc.data());
        });
    }

    async viewProfileDetails(userId, profileState,  attendingState, attendedState, groupState, setAttending, setAttended) {
        const docRef = query(collection(firestore, "users"),where("userId", "==", userId));
        const docu = await getDocs(docRef);
        await docu.forEach((doc) => {
            if (!doc.data().settings.eventAttending) {
                if (!doc.data().settings.eventAttended) {
                    // Full Private
                }else {
                    // Attended only
                    attendedState(true);
                }
            }else {
                if (doc.data().settings.eventAttended) {
                    // Both Ok
                    attendedState(true);
                    attendingState(true);
                    setAttending(true);
                    setAttended(false);
                }else {
                    // Attending only
                    attendingState(true);
                    setAttending(true);
                }
            }

            if (doc.data().settings.groupJoined) {
                groupState(true);
            }
            profileState(doc.data());
        });
    }

    async getNumEvents(userId, setState) {
        const docRef = query(
            collection(firestore, "events"),
            where("creatorID", "==", userId)
          );
          const docu = await getDocs(docRef);
          const docRef1 = query(
            collection(firestore, "events"),
            where("eventAttendees", "array-contains", userId)
          );
          const docu1 = await getDocs(docRef1);
          const no = docu.docs.length + docu1.docs.length;
          setState(no);
    }
    // Get events joined by user
    async getUserJoinedEvents(userId, joinState, attendedState) {
        const docRef = query(collection(firestore, "events"),where("eventAttendees", "array-contains", userId));
        const docu = await getDocs(docRef);

        var updatedEvent = [];
        var completedEvents = [];
        docu.forEach((doc)=> {
            var data = Object.assign({}, doc.data() ,{
                id: doc.id
            });
            if(new Date(doc.data().date) < this.today) {
                completedEvents = [...completedEvents, data];
            }else {
                updatedEvent = [...updatedEvent, data]
            }
        });
        joinState(updatedEvent);
        attendedState(completedEvents);
    }

    // Get events created by user
    async getUserCreatedEvents(userId,joinState, attendedState) {
        const docRef = query(collection(firestore, "events"),where("creatorID", "==", userId));
        const docu = await getDocs(docRef);

        var updatedEvent = [];
        var completedEvents = [];
        docu.forEach((doc)=> {
            var data = Object.assign({}, doc.data() ,{
                id: doc.id
            });
            if(new Date(doc.data().date) < this.today) {
                completedEvents = [...completedEvents, data];
            }else {
                updatedEvent = [...updatedEvent, data]
            }
        });
        joinState(updatedEvent);
        attendedState(completedEvents);
    }

    // Returns list of user's joined groups and the details to display
    async getUserJoinedGroups(userId, setState) {
        const docRef = query(
            collection(firestore, "group"),
            where("groupmembers", "array-contains", userId)
          );
          const docu = await getDocs(docRef);
          var updatedGroups = [];
          await Promise.all(docu.docs.map(async (doc)=> {
            var group =[doc.data()];
            const docRef = query(collection(firestore, "users"), where("userId", "==", doc.data().groupOwner));
            const docu2 = await getDocs(docRef);
            group[0].groupOwner = docu2.docs[0].data().displayName;
            if (group) {
                group[0].groupId = doc.id;
                updatedGroups = [...updatedGroups, ...group];
            }
            }));
            setState([...updatedGroups]);
    } 

    // Returns list of user's created groups and the details to display
    async getUserCreatedGroups(userId, setState) {
        const docRef = query(collection(firestore, "group"),where("groupOwner", "==", userId));
        const docu = await getDocs(docRef);
        var updatedGroups = [];

        await Promise.all(docu.docs.map(async (doc)=> {
            var group =[doc.data()];
            const docRef = query(collection(firestore, "users"), where("userId", "==", doc.data().groupOwner));
            const docu2 = await getDocs(docRef);
            group[0].groupOwner = docu2.docs[0].data().displayName;
            if (group) {
                group[0].groupId = doc.id;
                updatedGroups = [...updatedGroups, ...group];
            }
        }));
        setState([...updatedGroups]);
    }
}