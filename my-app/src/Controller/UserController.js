import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { firestore, auth } from "../Components/FirebaseDb/Firebase";
import { addDoc, collection} from "firebase/firestore";
import { dispatch } from "../App"

export class UserController {
    constructor(username, password) {
        this.username = username;
        this.password = password;
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

    
}