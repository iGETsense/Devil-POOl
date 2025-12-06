// API Route: Admin Authentication with Firebase
// POST /api/admin/auth - Login with Firebase ID token
// GET /api/admin/auth - Verify admin session

import { NextRequest, NextResponse } from "next/server"
import { verifyIdToken } from "@/lib/firebase-admin"
import { isAuthorizedAdmin } from "@/lib/firebase"

// POST - Verify Firebase ID token and check admin access
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { idToken } = body

        if (!idToken) {
            return NextResponse.json(
                { success: false, message: "Token requis" },
                { status: 400 }
            )
        }

        // Verify the Firebase ID token
        const decodedToken = await verifyIdToken(idToken)

        if (!decodedToken) {
            return NextResponse.json(
                { success: false, message: "Token invalide" },
                { status: 401 }
            )
        }

        // Check if user is an authorized admin
        if (!isAuthorizedAdmin(decodedToken.uid)) {
            return NextResponse.json(
                { success: false, message: "Accès non autorisé. Vous n'êtes pas administrateur." },
                { status: 403 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Authentification réussie",
            user: {
                uid: decodedToken.uid,
                email: decodedToken.email,
            },
        })

    } catch (error) {
        console.error("Auth error:", error)
        return NextResponse.json(
            { success: false, message: "Erreur d'authentification" },
            { status: 500 }
        )
    }
}

// GET - Verify current session
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Non authentifié" },
                { status: 401 }
            )
        }

        const token = authHeader.split("Bearer ")[1]
        const decodedToken = await verifyIdToken(token)

        if (!decodedToken) {
            return NextResponse.json(
                { success: false, message: "Session expirée" },
                { status: 401 }
            )
        }

        if (!isAuthorizedAdmin(decodedToken.uid)) {
            return NextResponse.json(
                { success: false, message: "Accès non autorisé" },
                { status: 403 }
            )
        }

        return NextResponse.json({
            success: true,
            user: {
                uid: decodedToken.uid,
                email: decodedToken.email,
            },
        })

    } catch (error) {
        console.error("Verify error:", error)
        return NextResponse.json(
            { success: false, message: "Erreur de vérification" },
            { status: 500 }
        )
    }
}
