import { NextRequest, NextResponse } from "next/server"
import { getBooking, markBookingAsPaid, updateRevenueByOperator, createBatchBookings, createBooking, updateBookingTransactionId, BookingInput } from "@/lib/database"
import { checkTransactionStatus, updateTransactionStatus } from "@/lib/mesomb"
import { getFirebaseDatabase } from "@/lib/firebase"
import { ref, get } from "firebase/database"

// GET - Check Payment Status
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("bookingId")
    const transactionId = searchParams.get("transactionId")

    // We accept either, but transactionId is preferred for strict mode
    if (!bookingId && !transactionId) {
        return NextResponse.json({ success: false, message: "ID manquant (bookingId ou transactionId)" }, { status: 400 })
    }

    try {
        // 1. Try to find the Transaction record first (Source of Truth)
        const db = getFirebaseDatabase()
        let transactionRecord: any = null;

        if (transactionId) {
            const snapshot = await get(ref(db, `transactions/${transactionId}`))
            if (snapshot.exists()) transactionRecord = snapshot.val()
        }

        // If we found a transaction, use it to check status
        if (transactionRecord) {
            // Check MeSomb status
            const statusResult = await checkTransactionStatus(transactionRecord.id)

            // Update our local transaction record
            await updateTransactionStatus(transactionRecord.id, statusResult.status, statusResult.transaction)

            // IF SUCCESS -> ENSURE BOOKING EXISTS
            let finalBookings: any[] = []

            if (statusResult.status === "SUCCESS") {
                const storedBookingId = transactionRecord.bookingId
                // Check if booking already exists with this generic ID (unlikely if strictly new, but possible if legacy)
                // Better: Check if we already created bookings linked to THIS transaction
                // We can't query by prop easily without index, so we rely on the metadata to decide 'should we create?'

                // Strategy: Try to fetch the booking by the stored ID.
                // If it exists, great. If not, create it.
                const existingBooking = await getBooking(storedBookingId)

                if (existingBooking) {
                    // Ensure it is paid
                    if (existingBooking.status !== 'paid' && existingBooking.status !== 'validated') {
                        await markBookingAsPaid(existingBooking.id)
                        await updateRevenueByOperator(existingBooking.operator, existingBooking.price)
                    }
                    finalBookings = [existingBooking]
                } else if (transactionRecord.metadata) {
                    // CREATE BOOKING JIT
                    const { phone, passType, operator, names } = transactionRecord.metadata

                    if (passType === "FIVE_QUEENS" && names && Array.isArray(names)) {
                        const inputs: BookingInput[] = names.map((n: string) => ({
                            fullName: n,
                            phone,
                            passType,
                            operator
                        }))
                        // Create batch
                        finalBookings = await createBatchBookings(inputs)

                        // Link and Mark Paid
                        for (const b of finalBookings) {
                            await updateBookingTransactionId(b.id, transactionRecord.id)
                            await markBookingAsPaid(b.id) // This also updates stats
                        }
                    } else {
                        // Single
                        const name = names && names.length > 0 ? names[0] : transactionRecord.metadata.name
                        const newBooking = await createBooking({
                            fullName: name,
                            phone,
                            passType: passType,
                            operator: operator
                        })
                        await updateBookingTransactionId(newBooking.id, transactionRecord.id)
                        await markBookingAsPaid(newBooking.id) // This also updates stats
                        finalBookings = [newBooking]
                    }
                }
            }

            return NextResponse.json({
                success: true,
                status: statusResult.status,
                bookings: finalBookings,
                message: statusResult.message
            })
        }

        // Fallback: Legacy Booking Check (if only bookingId provided)
        if (bookingId) {
            const booking = await getBooking(bookingId)
            if (!booking) {
                return NextResponse.json({ success: true, status: "PENDING", message: "Transaction introuvable" })
            }

            // If we have a booking, check its transaction
            if (booking.transactionId) {
                const statusResult = await checkTransactionStatus(booking.transactionId)

                if (statusResult.status === "SUCCESS" && booking.status !== "paid" && booking.status !== "validated") {
                    await markBookingAsPaid(booking.id)
                    await updateTransactionStatus(booking.transactionId, "SUCCESS")
                }
                return NextResponse.json({ success: true, status: statusResult.status, booking })
            }

            return NextResponse.json({ success: true, status: (booking.status === 'paid' || booking.status === 'validated') ? 'SUCCESS' : 'PENDING', booking })
        }

        return NextResponse.json({ success: false, message: "ID inconnu" })

    } catch (error: any) {
        console.error("Status check error:", error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
