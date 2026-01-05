import { NextResponse } from "next/server"
import { getPendingBookings, markBookingAsPaid, updateRevenueByOperator, updateTransactionStatus } from "@/lib/database"
import { MeSomb } from "@/lib/mesomb"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const pendingBookings = await getPendingBookings()
        console.log(`SYNC: Found ${pendingBookings.length} pending bookings.`)
        let updatedCount = 0

        for (const booking of pendingBookings) {
            // Check if we have a transaction ID or at least a booking ID can be used as reference?
            // MeSomb usually needs the transaction ID (pk) but checkStatus implementation 
            // relies on getTransaction(id).
            // If we stored transactionId, we use it. 
            // If not, we can try to use the Booking ID as reference filter if supported, 
            // but MeSomb Node SDK checks by ID.

            const txnId = booking.transactionId
            if (txnId) {
                try {
                    const statusResult = await MeSomb.checkStatus(txnId)
                    if (statusResult.status === "SUCCESS") {
                        const updated = await markBookingAsPaid(booking.id)
                        if (updated) {
                            await updateRevenueByOperator(updated.operator, updated.price)
                            await updateTransactionStatus(txnId, "SUCCESS", statusResult.transaction)
                            updatedCount++
                        }
                    } else if (statusResult.status === "FAILED") {
                        await updateTransactionStatus(txnId, "FAILED", statusResult.transaction)
                    }
                    // Optional: If FAILED, mark as cancelled?
                    // if (statusResult.status === "FAILED") { ... }
                } catch (e) {
                    console.error(`Error syncing booking ${booking.id}:`, e)
                }
            }
        }

        return NextResponse.json({
            success: true,
            checked: pendingBookings.length,
            updated: updatedCount,
            message: `Synced. ${updatedCount} payments confirmed.`
        })
    } catch (error: any) {
        console.error("Sync Error:", error)
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}
