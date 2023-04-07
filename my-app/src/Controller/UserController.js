import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { firestore, auth } from "../Components/FirebaseDb/Firebase";
import { addDoc, collection, query, where, getDocs} from "firebase/firestore";
import { dispatch } from "../App"

export class UserController {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.today = new Date();
        this.today.setHours(0,0,0,0);
    }
    async createAcc() {
        return await createUserWithEmailAndPassword(auth, this.username, this.password).then((reply) => {
            // Display Popup to tell user successful
            alert("Account created successfully");
            const today = new Date();
            const formattedDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

            var displayName = this.username.split("@")[0];
            addDoc(collection(firestore, 'users'), {
                userId: reply.user.uid,
                profilePic: "https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c",
                displayName: displayName,
                JoinedDate: formattedDate,
                Location: null,
                Bio: null,
                settings: {
                    groupJoined: true,
                    eventAttending: true,
                    eventAttended: true
                }
            });
            return "Success";
        }).catch((error) => {
            let code = error.code;
            return code;
        });
    }

    async login() {
        return await signInWithEmailAndPassword(auth, this.username, this.password).then((reply) => {
            if (reply.operationType == "signIn") {
                dispatch({newId: reply.user.uid});
                return "Success";
            }
        }).catch((error) => {
            return error.code;
        });
    }

    // Returns list of group names that user has created
    async getGroupsOwned(userId) {
        const docRef = query(collection(firestore, "group"), where("groupOwner", "==", userId));
        const docu = await getDocs(docRef);
        var fetchGroup = [];
        docu.forEach((doc)=> {
            fetchGroup = [...fetchGroup, {
                id: doc.id,
                name: doc.data().groupname
            }]
        })
        return fetchGroup;
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