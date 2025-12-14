import { NextRequest, NextResponse } from "next/server"
import { getBookingByQRCode, validateTicket } from "@/lib/database"

export async function POST(request: NextRequest) {
    try {
        // Parse body
        const body = await request.json()
        const { qrCode } = body

        if (!qrCode) {
            return NextResponse.json(
                { success: false, message: "Code QR manquant" },
                { status: 400 }
            )
        }

        console.log("Scanning QR:", qrCode)

        // 1. Find Booking
        const booking = await getBookingByQRCode(qrCode)

        if (!booking) {
            return NextResponse.json(
                { success: false, message: `Billet non trouvé pour: "${qrCode}"` },
                { status: 404 }
            )
        }

        // 2. Validate Ticket
        // Assuming "ADMIN" as validator for now since we disabled auth
        const validationResult = await validateTicket(booking.id, "ADMIN")

        if (validationResult.success) {
            return NextResponse.json({
                success: true,
                message: validationResult.message,
                booking: validationResult.booking
            })
        } else {
            return NextResponse.json({
                success: false,
                message: validationResult.message,
                booking: validationResult.booking
            })
        }

    } catch (error) {
        console.error("Scan error:", error)
        return NextResponse.json(
            { success: false, message: "Erreur lors du scan" },
            { status: 500 }
        )
    }
}
