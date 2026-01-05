import { NextRequest, NextResponse } from "next/server"
import { getFirebaseDatabase } from "@/lib/firebase"
import { ref, query, orderByChild, equalTo, get } from "firebase/database"
import { Booking } from "@/lib/database"

export async function POST(request: NextRequest) {
    try {
        const { phone } = await request.json()

        if (!phone) {
            return NextResponse.json(
                { success: false, message: "Numéro de téléphone requis" },
                { status: 400 }
            )
        }

        const formattedPhone = phone.replace(/\s/g, "")

        // Search in Firebase
        const db = getFirebaseDatabase()
        const bookingsRef = ref(db, "bookings")

        // Fetch ALL bookings and filter in memory to avoid "Index not defined" error
        const snapshot = await get(bookingsRef)

        let foundBookings: Booking[] = []

        if (snapshot.exists()) {
            snapshot.forEach((child) => {
                const b = child.val() as Booking

                // Check phone match (loose check for formats)
                // Normalize DB phone and Search phone
                const dbPhone = b.phone ? b.phone.replace(/\s/g, "") : ""
                const searchPhone = formattedPhone.replace(/\s/g, "")

                // Check if search phone is contained in DB phone or vice versa (e.g. +237)
                const isMatch = dbPhone.includes(searchPhone) || searchPhone.includes(dbPhone)

                if (isMatch && (b.status === "paid" || b.status === "validated")) {
                    foundBookings.push(b)
                }
            })
        }

        if (foundBookings.length === 0) {
            return NextResponse.json({
                success: true,
                found: false,
                message: "Aucun billet payé trouvé pour ce numéro."
            })
        }

        // Sort by date desc
        foundBookings.sort((a, b) => b.createdAt - a.createdAt)

        return NextResponse.json({
            success: true,
            found: true,
            bookings: foundBookings
        })

    } catch (error: any) {
        console.error("Retrieve error:", error)
        return NextResponse.json(
            { success: false, message: error.message || "Erreur de recherche" },
            { status: 500 }
        )
    }
}
