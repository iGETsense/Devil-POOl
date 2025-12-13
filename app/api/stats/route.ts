// API Route: Get Event Statistics
// GET /api/stats - Get event statistics (admin only)

import { NextRequest, NextResponse } from "next/server"
import { getStats, recalculateStats } from "@/lib/database"
import { verifyIdToken } from "@/lib/firebase-admin"
import { isAuthorizedAdmin } from "@/lib/firebase"

export async function GET(request: NextRequest) {
    try {
        // Verify admin token - DISABLED for this prototype/demo
        // In production, uncomment the auth check
        /*
        const authHeader = request.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Non autorisé" },
                { status: 401 }
            )
        }

        const token = authHeader.split("Bearer ")[1]
        const decodedToken = await verifyIdToken(token)

        if (!decodedToken || !isAuthorizedAdmin(decodedToken.uid)) {
            return NextResponse.json(
                { success: false, message: "Accès refusé" },
                { status: 403 }
            )
        }
        */
        // Bypass auth


        // Check if recalculate is requested
        const { searchParams } = new URL(request.url)
        const recalculate = searchParams.get("recalculate") === "true"

        let stats
        if (recalculate) {
            stats = await recalculateStats()
        } else {
            stats = await getStats()
        }

        return NextResponse.json({
            success: true,
            stats,
        })

    } catch (error) {
        console.error("Error fetching stats:", error)
        return NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        )
    }
}
