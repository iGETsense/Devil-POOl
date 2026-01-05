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
        // We might need to index 'phone' in firebase rules for this to work efficiently in prod,
        // but for <1000 items it's fine without index in some cases, or we filter client side if necessary.
        // Actually, let's use the query.
        const q = query(bookingsRef, orderByChild("phone"), equalTo(formattedPhone))

        const snapshot = await get(q)

        let foundBookings: Booking[] = []

        if (snapshot.exists()) {
            snapshot.forEach((child) => {
                const b = child.val() as Booking
                // Only return paid or validated tickets
                if (b.status === "paid" || b.status === "validated") {
                    foundBookings.push(b)
                }
            })
        }

        // Also try with/without +237 if no results?
        if (foundBookings.length === 0 && !formattedPhone.startsWith("+")) {
            const q2 = query(bookingsRef, orderByChild("phone"), equalTo("+" + formattedPhone))
            const snap2 = await get(q2)
            if (snap2.exists()) {
                snap2.forEach((child) => {
                    const b = child.val() as Booking
                    if (b.status === "paid" || b.status === "validated") {
                        foundBookings.push(b)
                    }
                })
            }
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
