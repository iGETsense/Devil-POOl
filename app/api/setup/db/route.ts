import { NextResponse } from "next/server"
import { getFirebaseDatabase } from "@/lib/firebase"
import { ref, set } from "firebase/database"

export async function GET() {
    try {
        const db = getFirebaseDatabase()

        // 1. Initialize Stats "Table"
        const initialStats = {
            totalBookings: 0,
            totalRevenue: 0,
            validatedCount: 0,
            pendingCount: 0,
            paidCount: 0,
            lastUpdated: Date.now()
        }

        await set(ref(db, "stats/event_genesis_vol1"), initialStats)

        // 2. We don't necessarily need to create a booking, but let's ensure the path exists/is cleaner
        // In RTDB, we don't "create" a table, but setting stats confirms connection and structure.

        return NextResponse.json({
            success: true,
            message: "Database structure initialized successfully. 'stats' node created."
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
