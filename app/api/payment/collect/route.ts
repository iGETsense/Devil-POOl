import { NextRequest, NextResponse } from "next/server"
import { createBooking, createBatchBookings, updateBookingTransactionId, saveTransaction, markBookingAsPaid, updateRevenueByOperator, BookingInput, PASS_PRICES, Booking } from "@/lib/database"
import { MeSomb } from "@/lib/mesomb"

// POST - Initiate Payment & Create Pending Transaction (No Booking yet)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { fullName, fullNames, phone, passType, operator } = body

        console.log("Payment Request Body:", JSON.stringify(body, null, 2))

        // 1. Basic Validation
        if (!phone || !passType || !operator) {
            return NextResponse.json(
                { success: false, message: "Champs requis manquants" },
                { status: 400 }
            )
        }

        if (!PASS_PRICES[passType]) {
            return NextResponse.json(
                { success: false, message: "Type de pass invalide" },
                { status: 400 }
            )
        }

        // Prepare data vars
        let totalAmount: number = 0;
        let names_list: string[] = [];

        if (passType === "FIVE_QUEENS") {
            if (!fullNames || !Array.isArray(fullNames)) {
                return NextResponse.json({ success: false, message: "Noms des Queens requis" }, { status: 400 })
            }
            names_list = fullNames.map((n: any) => String(n).trim())
            totalAmount = PASS_PRICES["FIVE_QUEENS"]
        } else {
            if (!fullName) {
                return NextResponse.json({ success: false, message: "Nom complet requis" }, { status: 400 })
            }
            names_list = [fullName.trim()]
            totalAmount = PASS_PRICES[passType]
        }

        // STRICT MODE: Do NOT create booking yet.
        // We only create the transaction record. Booking is created primarily on success.

        // Generate a Reserved reference ID
        const timestamp = Date.now().toString(36).toUpperCase()
        const random = Math.random().toString(36).substring(2, 7).toUpperCase()
        const reservedBookingId = `GEN-${timestamp}-${random}`

        // Prepare metadata for transaction
        const metadata = {
            name: names_list.length === 1 ? names_list[0] : undefined,
            phone: phone,
            passType: passType,
            operator: operator,
            names: names_list // Always store this
        }

        // 2. Initiate Payment with MeSomb
        const paymentResult = await MeSomb.collect({
            amount: totalAmount,
            payer: phone,
            service: operator === "orange" ? "ORANGE" : "MTN",
            reference: reservedBookingId,
            description: `Genesis ${passType} Booking`
        })

        if (!paymentResult.success) {
            return NextResponse.json(
                { success: false, message: paymentResult.message || "Échec de l'initialisation du paiement" },
                { status: 500 }
            )
        }

        // 3. Save Transaction Record
        if (paymentResult.transaction) {
            // Safe access to PK/ID
            // Depending on SDK version, it defaults to 'pk' or 'id'
            const tx: any = paymentResult.transaction;
            const transactionId = tx.pk || tx.id;

            if (transactionId) {
                console.log(`[CollectAPI] Saving Transaction ID: ${transactionId} for Booking ID: ${reservedBookingId}`)
                await saveTransaction({
                    id: transactionId,
                    bookingId: reservedBookingId, // Label only
                    amount: totalAmount,
                    status: tx.status === "SUCCESS" ? "SUCCESS" : "PENDING",
                    provider: "MESOMB",
                    rawResponse: tx,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    metadata: metadata
                })

                let reservedBookings: Booking[] = []

                // If IMMEDIATE SUCCESS
                if (tx.status === "SUCCESS") {
                    if (passType === "FIVE_QUEENS") {
                        const inputs: BookingInput[] = names_list.map((name: string) => ({
                            fullName: name,
                            phone,
                            passType,
                            operator
                        }))
                        const created = await createBatchBookings(inputs)
                        reservedBookings = created

                        // Link and Mark Paid
                        for (const b of reservedBookings) {
                            await updateBookingTransactionId(b.id, transactionId)
                            await markBookingAsPaid(b.id)
                        }

                    } else {
                        const b = await createBooking({
                            fullName: names_list[0],
                            phone,
                            passType,
                            operator
                        })
                        await updateBookingTransactionId(b.id, transactionId)
                        await markBookingAsPaid(b.id)
                        reservedBookings = [b]
                    }
                    // Update Revenue
                    // markBookingAsPaid handles revenue stats, so no need to double call unless we want to be sure
                    // database.ts:294 calls updateStats("increment", "totalRevenue"...) so we are good.
                }

                return NextResponse.json({
                    success: true,
                    message: "Paiement initié",
                    transactionId: transactionId,
                    bookingId: reservedBookingId, // Reserved ID
                    status: tx.status,
                    bookings: reservedBookings
                })
            }
        }

        return NextResponse.json({ success: false, message: "Transaction failed to initialize properly" }, { status: 500 })

    } catch (error: any) {
        console.error("Payment Collect Error:", error)
        return NextResponse.json(
            { success: false, message: error.message || "Erreur interne de paiement" },
            { status: 500 }
        )
    }
}
