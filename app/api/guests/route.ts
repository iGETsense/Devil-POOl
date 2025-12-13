
import { NextRequest, NextResponse } from "next/server"
import { getBookings } from "@/lib/database"

export async function GET(request: NextRequest) {
    try {
        // Disabled Auth for demo
        /*
        const authHeader = request.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 })
        }
        */

        const bookings = await getBookings()

        // Sort by date desc
        bookings.sort((a, b) => b.createdAt - a.createdAt)

        return NextResponse.json({
            success: true,
            reservations: bookings
        })

    } catch (error) {
        console.error("Error fetching guests:", error)
        return NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        )
    }
}
