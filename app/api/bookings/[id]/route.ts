// API Route: Get, Update, Delete single booking
// GET /api/bookings/[id] - Get booking by ID
// PATCH /api/bookings/[id] - Update booking status
// DELETE /api/bookings/[id] - Cancel booking

import { NextRequest, NextResponse } from "next/server"
import { getBooking, markBookingAsPaid, cancelBooking } from "@/lib/database"
import { verifyIdToken } from "@/lib/firebase-admin"
import { isAuthorizedAdmin } from "@/lib/firebase"

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET - Get single booking by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const booking = await getBooking(id)

        if (!booking) {
            return NextResponse.json(
                { success: false, message: "Réservation introuvable" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            booking,
        })

    } catch (error) {
        console.error("Error fetching booking:", error)
        return NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        )
    }
}

// PATCH - Update booking status (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

        const { id } = await params
        const body = await request.json()
        const { action } = body

        if (action === "markPaid") {
            const booking = await markBookingAsPaid(id)

            if (!booking) {
                return NextResponse.json(
                    { success: false, message: "Réservation introuvable" },
                    { status: 404 }
                )
            }

            return NextResponse.json({
                success: true,
                message: "Paiement confirmé",
                booking,
            })
        }

        return NextResponse.json(
            { success: false, message: "Action invalide" },
            { status: 400 }
        )

    } catch (error) {
        console.error("Error updating booking:", error)
        return NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        )
    }
}

// DELETE - Cancel booking (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

        const { id } = await params
        const success = await cancelBooking(id)

        if (!success) {
            return NextResponse.json(
                { success: false, message: "Réservation introuvable" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Réservation annulée",
        })

    } catch (error) {
        console.error("Error cancelling booking:", error)
        return NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        )
    }
}
