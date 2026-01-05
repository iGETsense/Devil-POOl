import { NextRequest, NextResponse } from "next/server"
import { createBooking, createBatchBookings, updateBookingTransactionId, saveTransaction, markBookingAsPaid, updateRevenueByOperator, BookingInput, PASS_PRICES, Booking } from "@/lib/database"
import { MeSomb } from "@/lib/mesomb"

// POST - Initiate Payment & Create Pending Booking
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { fullName, fullNames, phone, passType, operator } = body

        // 1. Basic Validation
        console.log("Payment Request Body:", JSON.stringify(body, null, 2))

        if (!phone || !passType || !operator) {
            return NextResponse.json(
                { success: false, message: "Champs requis manquants" },
                { status: 400 }
            )
        }

        if (!PASS_PRICES[passType]) {
            console.error(`Invalid passType: ${passType}`)
            return NextResponse.json(
                { success: false, message: "Type de pass invalide" },
                { status: 400 }
            )
        }

        // 2. Create Pending Booking(s) in Database
        let bookingId: string
        let totalAmount: number
        let bookings: Booking[] = []

        if (passType === "FIVE_QUEENS") {
            if (!fullNames || !Array.isArray(fullNames)) {
                return NextResponse.json({ success: false, message: "Noms des Queens requis" }, { status: 400 })
            }
            // Batch Create
            const inputs: BookingInput[] = fullNames.map((name: string) => ({
                fullName: name.trim(),
                phone: phone,
                passType,
                operator,
            }))
            const result = await createBatchBookings(inputs)
            bookings = result
            bookingId = result[0].id // Use first ID as reference for the group transaction
            totalAmount = PASS_PRICES["FIVE_QUEENS"]
        } else {
            // Single Create
            const input: BookingInput = {
                fullName: fullName.trim(),
                phone: phone,
                passType,
                operator,
            }
            const result = await createBooking(input)
            bookings = [result]
            bookingId = result.id
            totalAmount = PASS_PRICES[passType]
        }

        // 3. Initiate MeSomb Payment
        const paymentResult = await MeSomb.collect({
            amount: totalAmount,
            payer: phone,
            service: operator === "orange" ? "ORANGE" : "MTN",
            reference: bookingId,
            description: `Genesis ${passType} Booking`
        })

        if (!paymentResult.success) {
            // Optional: Mark bookings as cancelled if payment fails immediately? 
            // For now, leave as pending (they will just never be paid)
            return NextResponse.json({
                success: false,
                message: paymentResult.message || "Échec de l'initialisation du paiement",
            }, { status: 500 })
        }

        // 4. Return Pending Status & Transaction Info
        if (paymentResult.transaction && (paymentResult.transaction as any).pk) {
            // MeSomb returns 'pk' or 'id' as transaction ID usually. The SDK cast to any helps.
            // Actually, paymentResult.transaction might be the response object.
            // Let's assume paymentResult.transaction is the object and it has an id/pk. 
            // NOTE: We need to see what `paymentResult.transaction` is. 
            // In lib/mesomb.ts we return `response` as transaction.
            const transactionId = (paymentResult.transaction as any).pk || (paymentResult.transaction as any).id
            if (transactionId) {
                await updateBookingTransactionId(bookingId, transactionId)

                // Save dedicated transaction record
                await saveTransaction({
                    id: transactionId,
                    bookingId,
                    amount: totalAmount,
                    status: (paymentResult.transaction as any).status === "SUCCESS" ? "SUCCESS" : "PENDING",
                    provider: "MESOMB",
                    rawResponse: paymentResult.transaction,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                })

                // CRITICAL FIX: If MeSomb returns SUCCESS immediately, mark booking as paid!
                if ((paymentResult.transaction as any).status === "SUCCESS") {
                    await markBookingAsPaid(bookingId)
                    await updateRevenueByOperator(operator, totalAmount)
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: "Paiement initié",
            bookingId,
            bookings,
            transaction: paymentResult.transaction,
            amount: totalAmount
        })

    } catch (error: any) {
        console.error("Payment Collect Error [Stack]:", error.stack)
        console.error("Payment Collect Error [Msg]:", error.message)

        return NextResponse.json(
            { success: false, message: error.message || "Erreur interne de paiement" },
            { status: 500 }
        )
    }
}
