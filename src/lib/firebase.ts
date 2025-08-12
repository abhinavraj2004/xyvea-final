// This file initializes the Firebase SDK and exports the necessary services.
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// This is securely fetched and is safe to be client-side
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
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
