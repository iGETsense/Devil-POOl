// Firebase Admin SDK - Server-side only
// Used for secure operations in API routes

import admin from "firebase-admin"

// Service account credentials - Update with your actual service account values
// Get from Firebase Console > Project Settings > Service Accounts > Generate new private key
const serviceAccount = {
    type: "service_account",
    project_id: "studio-907723573-eab8c",
    private_key_id: "YOUR_PRIVATE_KEY_ID",
    private_key: "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-xxxxx@studio-907723573-eab8c.iam.gserviceaccount.com",
    client_id: "YOUR_CLIENT_ID",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40studio-907723573-eab8c.iam.gserviceaccount.com"
}

// Database URL
const databaseURL = "https://studio-907723573-eab8c-default-rtdb.firebaseio.com"

// Initialize Firebase Admin (singleton pattern)
function initializeFirebaseAdmin() {
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            databaseURL: databaseURL,
        })
    }
    return admin
}

// Get Admin Auth instance
export function getAdminAuth() {
    initializeFirebaseAdmin()
    return admin.auth()
}

// Get Admin Database instance
export function getAdminDatabase() {
    initializeFirebaseAdmin()
    return admin.database()
}

// Verify ID token from client
// Verify ID token from client
export async function verifyIdToken(idToken: string) {
    try {
        // Check if we have valid credentials before trying Admin SDK
        if (!serviceAccount.private_key || serviceAccount.private_key.includes("YOUR_PRIVATE_KEY")) {
            throw new Error("Missing Service Account Credentials")
        }

        const auth = getAdminAuth()
        const decodedToken = await auth.verifyIdToken(idToken)
        return decodedToken
    } catch (error) {
        console.warn("Admin SDK verification failed, falling back to REST API:", error)

        // Fallback: Verify via Firebase REST API (Identity Toolkit)
        // This validates the token using the Web API Key instead of Service Account
        try {
            const API_KEY = "AIzaSyBBCrV8CYW6AvNqiqB4BkAOYK9XSqBRZAQ" // From lib/firebase.ts
            const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken })
            })

            const data = await response.json()

            if (data.users && data.users.length > 0) {
                const user = data.users[0]
                // Return a mock DecodedToken structure based on real user data
                return {
                    uid: user.localId,
                    email: user.email,
                    email_verified: user.emailVerified,
                    // Add other fields as needed
                }
            }
            return null
        } catch (restError) {
            console.error("REST API verification failed:", restError)
            return null
        }
    }
}

export default admin
