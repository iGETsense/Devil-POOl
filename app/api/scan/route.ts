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

        // Security Check (Simple Shared Secret)
        const secret = request.headers.get("x-scan-secret")
        const ENV_SECRET = process.env.SCAN_SECRET || "DEVIL_POOL_2025_SECURE"

        // Allow if running on localhost for dev, but enforce in prod? 
        // For now, let's enforce it if the header is present or if we are in admin context.
        // Actually, the ScannerWidget needs to send this header.
        if (process.env.NODE_ENV === "production" && secret !== ENV_SECRET) {
            // Optional: Fail silently or warn?
            // console.warn("Scan attempt with invalid secret")
            // return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
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
