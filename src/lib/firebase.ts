// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "causalcanvas-92d9h",
  "appId": "1:208507964959:web:7cd64a2f9701be03280f2a",
  "storageBucket": "causalcanvas-92d9h.firebasestorage.app",
  "apiKey": "AIzaSyCBYc0Uufd8obKkkeClcILmV5ONczc-kCQ",
  "authDomain": "causalcanvas-92d9h.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "208507964959"
};


// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
