// API Route: Validate Ticket
// POST /api/tickets/validate - Validate ticket by QR code or booking ID

import { NextRequest, NextResponse } from "next/server"
import { validateTicket, getBooking, getBookingByQRCode } from "@/lib/database"
import { verifyIdToken } from "@/lib/firebase-admin"
import { isAuthorizedAdmin } from "@/lib/firebase"

export async function POST(request: NextRequest) {
    try {
        // Verify admin token
        const authHeader = request.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Non autorisé" },
                { status: 401 }
            )
        }

        const token = authHeader.split("Bearer ")[1]
        const decodedToken = await verifyIdToken(token)

        if (!decodedToken || !isAuthorizedAdmin(decodedToken.uid)) {
            return NextResponse.json(
                { success: false, message: "Accès refusé" },
                { status: 403 }
            )
        }

        const body = await request.json()
        const { qrCode, bookingId } = body

        if (!qrCode && !bookingId) {
            return NextResponse.json(
                { success: false, message: "QR code ou ID de réservation requis" },
                { status: 400 }
            )
        }

        let booking = null
        let targetBookingId = bookingId

        // If QR code provided, find booking by QR code
        if (qrCode) {
            // Parse QR code - format: GENESIS-{bookingId} or just the raw data
            const qrData = qrCode.toString()

            // Try to find by exact QR code match
            booking = await getBookingByQRCode(qrData)

            if (!booking) {
                // Try to extract booking ID from QR code
                const match = qrData.match(/GENESIS-(.+)/) || qrData.match(/GEN-(.+)/)
                if (match) {
                    targetBookingId = match[1].startsWith("GEN-") ? match[1] : `GEN-${match[1]}`
                } else {
                    // Maybe the QR code IS the booking ID
                    targetBookingId = qrData
                }
            }
        }

        // If we still don't have a booking, try by ID
        if (!booking && targetBookingId) {
            booking = await getBooking(targetBookingId)
        }

        if (!booking) {
            return NextResponse.json({
                success: false,
                message: "❌ QR Code invalide ou billet introuvable",
            })
        }

        // Validate the ticket
        const result = await validateTicket(booking.id, decodedToken.uid)

        return NextResponse.json({
            success: result.success,
            message: result.message,
            booking: result.booking,
        })

    } catch (error) {
        console.error("Error validating ticket:", error)
        return NextResponse.json(
            { success: false, message: "Erreur lors de la validation" },
            { status: 500 }
        )
    }
}
