// Database Service - All booking and ticket operations
// Uses Firebase Realtime Database

import { getAdminDatabase } from "./firebase-admin"
import { ref, get, set, update, push, query, orderByChild, equalTo } from "firebase/database"

// Types
export interface Booking {
    id: string
    fullName: string
    phone: string
    passType: "ONE_MAN" | "ONE_LADY" | "FIVE_QUEENS"
    operator: "orange" | "mtn" | "cash"
    price: number
    status: "pending" | "paid" | "validated" | "cancelled"
    qrCode: string
    createdAt: number
    paidAt?: number
    validatedAt?: number
    validatedBy?: string
}

export interface BookingInput {
    fullName: string
    phone: string
    passType: "ONE_MAN" | "ONE_LADY" | "FIVE_QUEENS"
    operator: "orange" | "mtn" | "cash"
}

export interface Stats {
    totalBookings: number
    totalRevenue: number
    validatedCount: number
    pendingCount: number
    paidCount: number
    lastUpdated: number
}

// Pass prices in FCFA
export const PASS_PRICES: Record<string, number> = {
    "ONE_MAN": 15000,
    "ONE_LADY": 10000,
    "FIVE_QUEENS": 5000,
}

// Generate unique booking ID
function generateBookingId(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 7).toUpperCase()
    return `GEN-${timestamp}-${random}`
}

// Generate QR code data string
function generateQRCodeData(bookingId: string): string {
    return `GENESIS-${bookingId}`
}

// ============ BOOKING OPERATIONS ============

// Create a new booking
export async function createBooking(input: BookingInput): Promise<Booking> {
    const db = getAdminDatabase()
    const bookingId = generateBookingId()

    const booking: Booking = {
        id: bookingId,
        fullName: input.fullName,
        phone: input.phone,
        passType: input.passType,
        operator: input.operator,
        price: PASS_PRICES[input.passType] || 0,
        status: "pending",
        qrCode: generateQRCodeData(bookingId),
        createdAt: Date.now(),
    }

    // Save to Firebase
    await db.ref(`bookings/${bookingId}`).set(booking)

    // Update stats
    await updateStats("increment", "totalBookings")

    return booking
}

// Get booking by ID
export async function getBooking(bookingId: string): Promise<Booking | null> {
    const db = getAdminDatabase()
    const snapshot = await db.ref(`bookings/${bookingId}`).get()

    if (snapshot.exists()) {
        return snapshot.val() as Booking
    }
    return null
}

// Get booking by QR code
export async function getBookingByQRCode(qrCode: string): Promise<Booking | null> {
    const db = getAdminDatabase()
    const snapshot = await db.ref("bookings")
        .orderByChild("qrCode")
        .equalTo(qrCode)
        .limitToFirst(1)
        .get()

    if (snapshot.exists()) {
        const bookings = snapshot.val()
        const bookingId = Object.keys(bookings)[0]
        return bookings[bookingId] as Booking
    }
    return null
}

// Get all bookings (with optional status filter)
export async function getBookings(status?: string): Promise<Booking[]> {
    const db = getAdminDatabase()
    let snapshot

    if (status) {
        snapshot = await db.ref("bookings")
            .orderByChild("status")
            .equalTo(status)
            .get()
    } else {
        snapshot = await db.ref("bookings")
            .orderByChild("createdAt")
            .get()
    }

    if (snapshot.exists()) {
        const bookings = snapshot.val()
        return Object.values(bookings) as Booking[]
    }
    return []
}

// Update booking status to paid
export async function markBookingAsPaid(bookingId: string): Promise<Booking | null> {
    const db = getAdminDatabase()
    const booking = await getBooking(bookingId)

    if (!booking) {
        return null
    }

    const updates = {
        status: "paid",
        paidAt: Date.now(),
    }

    await db.ref(`bookings/${bookingId}`).update(updates)

    // Update stats
    await updateStats("increment", "totalRevenue", booking.price)
    await updateStats("decrement", "pendingCount")
    await updateStats("increment", "paidCount")

    return { ...booking, ...updates } as Booking
}

// Validate ticket (scan at entry)
export async function validateTicket(bookingId: string, adminUid: string): Promise<{ success: boolean; message: string; booking?: Booking }> {
    const db = getAdminDatabase()
    const booking = await getBooking(bookingId)

    if (!booking) {
        return { success: false, message: "Billet introuvable" }
    }

    if (booking.status === "validated") {
        return {
            success: false,
            message: `Ce billet a déjà été scanné le ${new Date(booking.validatedAt!).toLocaleString("fr-FR")}`,
            booking
        }
    }

    if (booking.status === "pending") {
        return {
            success: false,
            message: "Ce billet n'a pas encore été payé",
            booking
        }
    }

    if (booking.status === "cancelled") {
        return {
            success: false,
            message: "Ce billet a été annulé",
            booking
        }
    }

    // Mark as validated
    const updates = {
        status: "validated",
        validatedAt: Date.now(),
        validatedBy: adminUid,
    }

    await db.ref(`bookings/${bookingId}`).update(updates)

    // Update stats
    await updateStats("increment", "validatedCount")
    await updateStats("decrement", "paidCount")

    return {
        success: true,
        message: "✅ Billet validé ! Accès autorisé",
        booking: { ...booking, ...updates } as Booking
    }
}

// Cancel booking
export async function cancelBooking(bookingId: string): Promise<boolean> {
    const db = getAdminDatabase()
    const booking = await getBooking(bookingId)

    if (!booking) {
        return false
    }

    await db.ref(`bookings/${bookingId}`).update({
        status: "cancelled",
    })

    return true
}

// ============ STATS OPERATIONS ============

// Get event statistics
export async function getStats(): Promise<Stats> {
    const db = getAdminDatabase()
    const snapshot = await db.ref("stats/event_genesis_vol1").get()

    if (snapshot.exists()) {
        return snapshot.val() as Stats
    }

    // Return default stats if none exist
    return {
        totalBookings: 0,
        totalRevenue: 0,
        validatedCount: 0,
        pendingCount: 0,
        paidCount: 0,
        lastUpdated: Date.now(),
    }
}

// Update stats (helper function)
async function updateStats(operation: "increment" | "decrement", field: keyof Stats, value: number = 1) {
    const db = getAdminDatabase()
    const statsRef = db.ref("stats/event_genesis_vol1")

    const snapshot = await statsRef.get()
    const currentStats = snapshot.exists() ? snapshot.val() : {
        totalBookings: 0,
        totalRevenue: 0,
        validatedCount: 0,
        pendingCount: 0,
        paidCount: 0,
        lastUpdated: Date.now(),
    }

    if (operation === "increment") {
        currentStats[field] = (currentStats[field] || 0) + value
    } else {
        currentStats[field] = Math.max(0, (currentStats[field] || 0) - value)
    }
    currentStats.lastUpdated = Date.now()

    await statsRef.set(currentStats)
}

// Recalculate stats from all bookings (use if stats get out of sync)
export async function recalculateStats(): Promise<Stats> {
    const bookings = await getBookings()

    const stats: Stats = {
        totalBookings: bookings.length,
        totalRevenue: bookings
            .filter(b => b.status === "paid" || b.status === "validated")
            .reduce((sum, b) => sum + b.price, 0),
        validatedCount: bookings.filter(b => b.status === "validated").length,
        pendingCount: bookings.filter(b => b.status === "pending").length,
        paidCount: bookings.filter(b => b.status === "paid").length,
        lastUpdated: Date.now(),
    }

    const db = getAdminDatabase()
    await db.ref("stats/event_genesis_vol1").set(stats)

    return stats
}
