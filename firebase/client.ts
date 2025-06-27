// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5cOd0PhSixFPHI45i4Ro_duL0rN9CRN8",
  authDomain: "hirelyze-ai.firebaseapp.com",
  projectId: "hirelyze-ai",
  storageBucket: "hirelyze-ai.firebasestorage.app",
  messagingSenderId: "582032856319",
  appId: "1:582032856319:web:90228cea287c84843d68ca",
  measurementId: "G-CW4EYVVGD3"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);