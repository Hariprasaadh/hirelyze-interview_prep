import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth";
import { getFirestore as getFireStore } from "firebase-admin/firestore"; 

const initFireBaseAdmin = () => {
    const apps = getApps();

    if(!apps.length){  //To make sure we only initialize once
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') 
            })
        })
    }

    return {
        auth: getAuth(),
        db: getFireStore(),

    }
}

export const { auth, db } = initFireBaseAdmin();