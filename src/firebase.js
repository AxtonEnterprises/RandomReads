import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
const firebaseConfig = {
  apiKey: "AIzaSyA_RVb_1Gafl5m_LsRPf5PrmRL-SInsN6M",
  authDomain: "random-reads-10add.firebaseapp.com",
  databaseURL: "https://random-reads-10add-default-rtdb.firebaseio.com",
  projectId: "random-reads-10add",
  storageBucket: "random-reads-10add.firebasestorage.app",
  messagingSenderId: "424669347546",
  appId: "1:424669347546:web:92104ea189afaf60676fe3",
  measurementId: "G-T91PLGK922"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

