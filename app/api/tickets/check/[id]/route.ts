// API Route: Check Ticket Status
// GET /api/tickets/check/[id] - Check ticket validity without validating

import { NextRequest, NextResponse } from "next/server"
import { getBooking } from "@/lib/database"

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const booking = await getBooking(id)

        if (!booking) {
            return NextResponse.json({
                success: false,
                valid: false,
                message: "Billet introuvable",
            })
        }

        // Check ticket status
        let valid = false
        let message = ""

        switch (booking.status) {
            case "pending":
                message = "⏳ Paiement en attente"
                break
            case "paid":
                valid = true
                message = "✅ Billet valide - Prêt pour l'entrée"
                break
            case "validated":
                message = `⚠️ Déjà utilisé le ${new Date(booking.validatedAt!).toLocaleString("fr-FR")}`
                break
            case "cancelled":
                message = "❌ Billet annulé"
                break
            default:
                message = "Statut inconnu"
        }

        return NextResponse.json({
            success: true,
            valid,
            message,
            booking: {
                id: booking.id,
                fullName: booking.fullName,
                passType: booking.passType,
                status: booking.status,
            },
        })

    } catch (error) {
        console.error("Error checking ticket:", error)
        return NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        )
    }
}
