import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBX6PVX5VSLSc_BE1WT-ao5HzV00UxbfsM",
  authDomain: "ai-trip-planner-754a4.firebaseapp.com",
  projectId: "ai-trip-planner-754a4",
  storageBucket: "ai-trip-planner-754a4.firebasestorage.app",
  messagingSenderId: "108904607058",
  appId: "1:108904607058:web:ed7654d3ee12147c5f5e8b",
  measurementId: "G-69D66RQ3C7"
};

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)