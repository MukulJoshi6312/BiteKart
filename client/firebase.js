// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "gurbgo-72e6b.firebaseapp.com",
  projectId: "gurbgo-72e6b",
  storageBucket: "gurbgo-72e6b.firebasestorage.app",
  messagingSenderId: "889510637488",
  appId: "1:889510637488:web:4db256667b322a6f913075"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app,auth};