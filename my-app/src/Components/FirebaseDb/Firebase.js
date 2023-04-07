// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrqO7kUubiwsBRVV1CPC3ubSKymrsbjck",
  authDomain: "sc2006-fitnessfriends-66854.firebaseapp.com",
  projectId: "sc2006-fitnessfriends-66854",
  storageBucket: "sc2006-fitnessfriends-66854.appspot.com",
  messagingSenderId: "678949380524",
  appId: "1:678949380524:web:5585f6637e1bb23b27da09",
  measurementId: "G-X2LH01D5N8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
