
import { NextResponse } from "next/server"
import { getFirebaseDatabase } from "@/lib/firebase"
import { ref, set, remove } from "firebase/database"

export async function GET() {
    try {
        const db = getFirebaseDatabase()

        // 1. Remove all bookings
        await remove(ref(db, "bookings"))

        // 2. Remove all transactions
        await remove(ref(db, "transactions"))

        // 3. Reset Stats
        const initialStats = {
            totalBookings: 0,
            totalRevenue: 0,
            revenueOrange: 0,
            revenueMTN: 0,
            validatedCount: 0,
            pendingCount: 0,
            paidCount: 0,
            lastUpdated: Date.now()
        }

        // Note: Using the same key as database.ts updates "stats/event_genesis_vol1"
        // But dashboard reads from "stats/event_genesis_vol1" usually or root stats?
        // lib/database.ts line 280: ref(db, "stats/event_genesis_vol1")

        await set(ref(db, "stats/event_genesis_vol1"), initialStats)

        return NextResponse.json({
            success: true,
            message: "Database Cleared: Bookings, Transactions, and Stats have been reset."
        })
    } catch (error: any) {
        console.error("Reset Error:", error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
