import { NextRequest, NextResponse } from "next/server"
import { getBooking, markBookingAsPaid, updateRevenueByOperator, updateTransactionStatus } from "@/lib/database"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log("PAYMENT WEBHOOK RECEIVED:", JSON.stringify(body, null, 2))

        // MeSomb Webhook Payload Structure typically contains:
        // { pk: "...", status: "SUCCESS", reference: "GEN-...", ... }
        // OR it might be wrapped. We'll handle common fields.

        const { status, reference, pk, id } = body
        const transactionId = pk || id
        const bookingId = reference

        if (!bookingId) {
            return NextResponse.json({ success: false, message: "No reference found" }, { status: 400 })
        }

        if (status === "SUCCESS") {
            const updatedBooking = await markBookingAsPaid(bookingId)

            if (updatedBooking) {
                await updateRevenueByOperator(updatedBooking.operator, updatedBooking.price)
                console.log(`Webhook: Payment confirmed for ${bookingId}`)
            } else {
                console.warn(`Webhook: Booking ${bookingId} not found or update failed`)
            }

            if (transactionId) {
                await updateTransactionStatus(transactionId, "SUCCESS", body)
            }

        } else if (status === "FAILED") {
            // Optional: Mark as cancelled
            console.log(`Webhook: Payment failed for ${bookingId}`)

            if (transactionId) {
                await updateTransactionStatus(transactionId, "FAILED", body)
            }
        }

        return NextResponse.json({ success: true, message: "Webhook processed" })

    } catch (error: any) {
        console.error("Webhook Error:", error)
        return NextResponse.json(
            { success: false, message: "Internal Error" },
            { status: 500 }
        )
    }
}
