// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore, doc, setDoc} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBrfihHg1nCIVl_4bVrezkoKjFr8BbR96s",
  authDomain: "financely-5f2b7.firebaseapp.com",
  projectId: "financely-5f2b7",
  storageBucket: "financely-5f2b7.firebasestorage.app",
  messagingSenderId: "832916817629",
  appId: "1:832916817629:web:2d4611a67e6a94ae3c3d34",
  measurementId: "G-VNNL7VG1K4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc};