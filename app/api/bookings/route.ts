// API Route: Create and List Bookings
// POST /api/bookings - Create new booking
// GET /api/bookings - List all bookings (admin only)

import { NextRequest, NextResponse } from "next/server"
import { createBooking, createBatchBookings, getBookings, BookingInput, PASS_PRICES } from "@/lib/database"
import { verifyIdToken } from "@/lib/firebase-admin"
import { isAuthorizedAdmin } from "@/lib/firebase"

// POST - Create new booking
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { fullName, fullNames, phone, passType, operator } = body

        // Validate required fields
        if ((!fullName && !fullNames) || !phone || !passType || !operator) {
            return NextResponse.json(
                { success: false, message: "Tous les champs sont requis" },
                { status: 400 }
            )
        }

        // Validate pass type
        if (!["ONE_MAN", "ONE_LADY", "FIVE_QUEENS"].includes(passType)) {
            return NextResponse.json(
                { success: false, message: "Type de pass invalide" },
                { status: 400 }
            )
        }

        // Validate operator
        if (!["orange", "mtn", "cash"].includes(operator)) {
            return NextResponse.json(
                { success: false, message: "Opérateur invalide" },
                { status: 400 }
            )
        }

        // Validate phone format (Cameroon)
        const phoneRegex = /^(\+237)?[6-9]\d{8}$/
        const cleanPhone = phone.replace(/\s/g, "")
        if (!phoneRegex.test(cleanPhone)) {
            return NextResponse.json(
                { success: false, message: "Numéro de téléphone invalide" },
                { status: 400 }
            )
        }

        // Handle FIVE_QUEENS with multiple names
        if (passType === "FIVE_QUEENS") {
            if (!fullNames || !Array.isArray(fullNames) || fullNames.length !== 5) {
                return NextResponse.json(
                    { success: false, message: "5 noms sont requis pour le pass Five Queens" },
                    { status: 400 }
                )
            }

            // Create batch bookings
            const inputs: BookingInput[] = fullNames.map((name: string) => ({
                fullName: name.trim(),
                phone: cleanPhone,
                passType,
                operator,
            }))

            const bookings = await createBatchBookings(inputs)

            return NextResponse.json({
                success: true,
                message: "Réservations créées avec succès",
                bookings, // Return array
                price: PASS_PRICES[passType],
            })
        }

        // Standard Single Booking
        const bookingInput: BookingInput = {
            fullName: fullName.trim(),
            phone: cleanPhone,
            passType,
            operator,
        }

        const booking = await createBooking(bookingInput)

        return NextResponse.json({
            success: true,
            message: "Réservation créée avec succès",
            booking,
            price: PASS_PRICES[passType],
        })

    } catch (error) {
        console.error("Error creating booking:", error)
        return NextResponse.json(
            { success: false, message: "Erreur lors de la création de la réservation" },
            { status: 500 }
        )
    }
}

// GET - List all bookings (admin only)
export async function GET(request: NextRequest) {
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

        // Get status filter from query params
        const { searchParams } = new URL(request.url)
        const status = searchParams.get("status") || undefined

        const bookings = await getBookings(status)

        return NextResponse.json({
            success: true,
            bookings,
            count: bookings.length,
        })

    } catch (error) {
        console.error("Error fetching bookings:", error)
        return NextResponse.json(
            { success: false, message: "Erreur lors de la récupération des réservations" },
            { status: 500 }
        )
    }
}
