// Firebase Configuration - Server-side only (not exposed to frontend)
// This file contains hardcoded Firebase credentials for API routes

import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getDatabase, Database } from "firebase/database"

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBBCrV8CYW6AvNqiqB4BkAOYK9XSqBRZAQ",
    authDomain: "studio-907723573-eab8c.firebaseapp.com",
    databaseURL: "https://studio-907723573-eab8c-default-rtdb.firebaseio.com",
    projectId: "studio-907723573-eab8c",
    storageBucket: "studio-907723573-eab8c.firebasestorage.app",
    messagingSenderId: "426702985815",
    appId: "1:426702985815:web:270b6a363c7ce5114b2112"
}

// Authorized admin user IDs
export const AUTHORIZED_ADMINS = [
    "Gb3LYN68z2ferB56IWg4uRvpRtm2" // Main admin
]

let app: FirebaseApp
let auth: Auth
let database: Database

// Initialize Firebase (singleton pattern)
function getFirebaseApp(): FirebaseApp {
    if (!app) {
        const existingApps = getApps()
        if (existingApps.length > 0) {
            app = existingApps[0]
        } else {
            app = initializeApp(firebaseConfig)
        }
    }
    return app
}

export function getFirebaseAuth(): Auth {
    if (!auth) {
        auth = getAuth(getFirebaseApp())
    }
    return auth
}

export function getFirebaseDatabase(): Database {
    if (!database) {
        database = getDatabase(getFirebaseApp())
    }
    return database
}

// Check if user is an authorized admin
export function isAuthorizedAdmin(uid: string): boolean {
    return AUTHORIZED_ADMINS.includes(uid)
}

export { firebaseConfig }
