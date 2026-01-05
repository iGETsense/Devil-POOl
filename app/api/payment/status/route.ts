import { NextRequest, NextResponse } from "next/server"
import { getBooking, markBookingAsPaid, updateRevenueByOperator } from "@/lib/database"
import { MeSomb } from "@/lib/mesomb"

// GET - Check Payment Status
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const bookingId = searchParams.get("bookingId")
        const transactionId = searchParams.get("transactionId")

        if (!bookingId) {
            return NextResponse.json(
                { success: false, message: "bookingId requis" },
                { status: 400 }
            )
        }

        // Get the booking
        const booking = await getBooking(bookingId)
        if (!booking) {
            return NextResponse.json(
                { success: false, message: "Réservation introuvable" },
                { status: 404 }
            )
        }

        // If already paid, return success immediately
        if (booking.status === "paid" || booking.status === "validated") {
            return NextResponse.json({
                success: true,
                status: "SUCCESS",
                booking
            })
        }

        // If transactionId provided, check with MeSomb
        // If query param is missing, check if we have it on the booking
        const txnIdToCheck = transactionId || booking.transactionId

        if (txnIdToCheck) {
            const statusResult = await MeSomb.checkStatus(txnIdToCheck)

            if (statusResult.status === "SUCCESS") {
                // Mark booking as paid
                const updatedBooking = await markBookingAsPaid(bookingId)

                // Track revenue by operator
                if (updatedBooking) {
                    await updateRevenueByOperator(updatedBooking.operator, updatedBooking.price)
                }

                return NextResponse.json({
                    success: true,
                    status: "SUCCESS",
                    booking: updatedBooking
                })
            }

            return NextResponse.json({
                success: true,
                status: statusResult.status || "PENDING",
                message: statusResult.message
            })
        }

        // No transaction ID, just return current booking status
        return NextResponse.json({
            success: true,
            status: booking.status === "pending" ? "PENDING" : booking.status.toUpperCase(),
            booking
        })

    } catch (error: any) {
        console.error("Payment Status Error:", error)
        return NextResponse.json(
            { success: false, message: error.message || "Erreur interne" },
            { status: 500 }
        )
    }
}

// POST - Manually mark as paid (for webhook or admin)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { bookingId, transactionId } = body

        if (!bookingId) {
            return NextResponse.json(
                { success: false, message: "bookingId requis" },
                { status: 400 }
            )
        }

        const booking = await getBooking(bookingId)
        if (!booking) {
            return NextResponse.json(
                { success: false, message: "Réservation introuvable" },
                { status: 404 }
            )
        }

        // Mark as paid
        const updatedBooking = await markBookingAsPaid(bookingId)

        // Track revenue by operator
        if (updatedBooking) {
            await updateRevenueByOperator(updatedBooking.operator, updatedBooking.price)
        }

        return NextResponse.json({
            success: true,
            message: "Paiement confirmé",
            booking: updatedBooking
        })

    } catch (error: any) {
        console.error("Manual Payment Confirm Error:", error)
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        )
    }
}
