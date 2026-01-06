// Database Service - All booking and ticket operations
// Uses Firebase Client SDK (Modular) to avoid Service Account issues in this prototype

import { getFirebaseDatabase } from "./firebase"
import { ref, get, set, update, query, orderByChild, equalTo, limitToFirst } from "firebase/database"

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
    totalEntries: number
    entriesCount: number
    entries?: Array<{
        timestamp: number
        adminUid: string
    }>
    transactionId?: string
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
    revenueOrange: number
    revenueMTN: number
    validatedCount: number
    pendingCount: number
    paidCount: number
    lastUpdated: number
}

// Pass prices in FCFA
export const PASS_PRICES: Record<string, number> = {
    "ONE_MAN": 50,
    "ONE_LADY": 50,
    "FIVE_QUEENS": 50,
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

export interface TransactionRecord {
    id: string
    bookingId: string
    amount: number
    status: "PENDING" | "SUCCESS" | "FAILED"
    message?: string
    provider: "MESOMB"
    rawResponse?: any
    createdAt: number
    updatedAt: number
    metadata?: {
        name: string // Stored to create booking later if successful
        phone: string
        passType: string
    }
}

// ============ TRANSACTION OPERATIONS ============

export async function saveTransaction(record: TransactionRecord): Promise<void> {
    console.log(`[DB] Attempting to save transaction ${record.id}...`)
    try {
        const db = getFirebaseDatabase()
        await set(ref(db, `transactions/${record.id}`), record)
        console.log(`[DB] Transaction ${record.id} saved successfully.`)
    } catch (e) {
        console.error(`[DB] FAILED to save transaction ${record.id}:`, e)
        throw e
    }
}

export async function updateTransactionStatus(transactionId: string, status: "SUCCESS" | "FAILED", rawResponse?: any): Promise<void> {
    const db = getFirebaseDatabase()
    const updates: any = {
        status,
        updatedAt: Date.now()
    }
    if (rawResponse) {
        updates.rawResponse = rawResponse
    }
    await update(ref(db, `transactions/${transactionId}`), updates)
}

// Get all raw transactions
export async function getTransactions(): Promise<TransactionRecord[]> {
    const db = getFirebaseDatabase()
    const snapshot = await get(ref(db, 'transactions'))

    if (snapshot.exists()) {
        const transMap = snapshot.val()
        // Convert object to array and sort by date desc
        return Object.values(transMap).sort((a: any, b: any) => b.createdAt - a.createdAt) as TransactionRecord[]
    }
    return []
}

// ============ BOOKING OPERATIONS ============

// Create a new booking
export async function createBooking(input: BookingInput): Promise<Booking> {
    const db = getFirebaseDatabase()
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
        totalEntries: input.passType === "FIVE_QUEENS" ? 5 : 1,
        entriesCount: 0,
    }

    // Save to Firebase
    await set(ref(db, `bookings/${bookingId}`), booking)

    // Update stats
    await updateStats("increment", "totalBookings")

    return booking
}

// Create multiple bookings (Batch)
export async function createBatchBookings(inputs: BookingInput[]): Promise<Booking[]> {
    const db = getFirebaseDatabase()
    const bookings: Booking[] = []
    const updates: Record<string, any> = {}

    for (const input of inputs) {
        const bookingId = generateBookingId()
        let price = PASS_PRICES[input.passType] || 0
        // Split price for Five Queens pack
        if (input.passType === "FIVE_QUEENS") {
            price = Math.floor(price / 5)
        }

        const booking: Booking = {
            id: bookingId,
            fullName: input.fullName,
            phone: input.phone,
            passType: input.passType,
            operator: input.operator,
            price: price,
            status: "pending",
            qrCode: generateQRCodeData(bookingId),
            createdAt: Date.now(),
            totalEntries: 1,
            entriesCount: 0,
        }
        bookings.push(booking)
        updates[`bookings/${bookingId}`] = booking
    }

    // Atomic update for all bookings
    await update(ref(db), updates)

    // Update stats (count each ticket as a booking?)
    // Yes, 5 people = 5 bookings usually for capacity planning.
    await updateStats("increment", "totalBookings", inputs.length)

    return bookings
}

// Get booking by ID
export async function getBooking(bookingId: string): Promise<Booking | null> {
    const db = getFirebaseDatabase()
    const snapshot = await get(ref(db, `bookings/${bookingId}`))

    if (snapshot.exists()) {
        return snapshot.val() as Booking
    }
    return null
}

// Get booking by QR code
// Get booking by QR code
export async function getBookingByQRCode(qrCode: string): Promise<Booking | null> {
    if (!qrCode) return null

    const cleanCode = qrCode.trim()

    // Case 1: Standard QR Code (starts with GENESIS-)
    if (cleanCode.startsWith("GENESIS-")) {
        const bookingId = cleanCode.replace("GENESIS-", "")
        return await getBooking(bookingId)
    }

    // Case 2: Raw Booking ID (starts with GEN-)
    if (cleanCode.startsWith("GEN-")) {
        const booking = await getBooking(cleanCode)
        if (booking) return booking
    }

    // Case 3: JSON Format (Legacy/Incorrect QR Codes)
    if (cleanCode.startsWith("{") && cleanCode.endsWith("}")) {
        try {
            // Fix malformed JSON if necessary (e.g. replacing ; with :)
            // The user report showed {"id";"GEN..."} which is invalid JSON
            let jsonString = cleanCode
            if (jsonString.includes(";") && !jsonString.includes(":")) {
                jsonString = jsonString.replace(/;/g, ":")
            }
            // Fix single quotes if present
            if (jsonString.includes("'")) {
                jsonString = jsonString.replace(/'/g, '"')
            }

            const data = JSON.parse(jsonString)

            // Try ID from JSON
            if (data.id) {
                const booking = await getBooking(data.id)
                if (booking) return booking
            }

            // Fallback: Try Name from JSON
            if (data.name) {
                const bookings = await getBookings()
                // Loose match on name
                const match = bookings.find(b =>
                    b.fullName.toLowerCase().includes(data.name.toLowerCase()) ||
                    data.name.toLowerCase().includes(b.fullName.toLowerCase())
                )
                if (match) return match
            }
        } catch (e) {
            console.error("Failed to parse JSON QR:", e)
        }
    }

    // Case 4: Fallback - try as ID anyway (last resort)
    const booking = await getBooking(cleanCode)
    if (booking) return booking

    return null
}

// Get all bookings (with optional status filter)
export async function getBookings(status?: string): Promise<Booking[]> {
    const db = getFirebaseDatabase()

    // Fetch all bookings directly (avoid index issues)
    const snapshot = await get(ref(db, "bookings"))

    if (snapshot.exists()) {
        const bookingsMap = snapshot.val()
        let bookings = Object.values(bookingsMap) as Booking[]

        // Filter by status if provided
        if (status) {
            bookings = bookings.filter(b => b.status === status)
        }

        return bookings
    }
    return []
}

// Update booking status to paid
export async function markBookingAsPaid(bookingId: string): Promise<Booking | null> {
    const db = getFirebaseDatabase()
    const booking = await getBooking(bookingId)

    if (!booking) {
        return null
    }

    const updates = {
        status: "paid",
        paidAt: Date.now(),
    }

    await update(ref(db, `bookings/${bookingId}`), updates)

    // Update stats
    await updateStats("increment", "totalRevenue", booking.price)
    await updateStats("decrement", "pendingCount")
    await updateStats("increment", "paidCount")

    return { ...booking, ...updates } as Booking
}

// Update Booking with Transaction ID
export async function updateBookingTransactionId(bookingId: string, transactionId: string): Promise<void> {
    const db = getFirebaseDatabase()
    const bookingRef = ref(db, `bookings/${bookingId}`)
    await update(bookingRef, { transactionId })
}

// Get all pending bookings
export async function getPendingBookings(): Promise<Booking[]> {
    const db = getFirebaseDatabase()
    const bookingsRef = ref(db, 'bookings')
    const pendingQuery = query(bookingsRef, orderByChild('status'), equalTo('pending'))

    const snapshot = await get(pendingQuery)
    if (snapshot.exists()) {
        const bookings: Booking[] = []
        snapshot.forEach((child) => {
            bookings.push(child.val())
        })
        return bookings
    }
    return []
}

// Validate ticket (scan at entry)
export async function validateTicket(bookingId: string, adminUid: string): Promise<{ success: boolean; message: string; booking?: Booking }> {
    const db = getFirebaseDatabase()
    const booking = await getBooking(bookingId)

    if (!booking) {
        return { success: false, message: "Billet introuvable" }
    }

    // Default values for legacy bookings
    const totalEntries = booking.totalEntries || (booking.passType === "FIVE_QUEENS" ? 5 : 1)
    let entriesCount = booking.entriesCount || 0

    if (entriesCount >= totalEntries || booking.status === "validated") {
        return {
            success: false,
            message: `Ce billet a déjà été entièrement scanné (${entriesCount}/${totalEntries})`,
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

    // Update entry tracking
    entriesCount += 1
    const newEntry = {
        timestamp: Date.now(),
        adminUid: adminUid,
    }
    const entries = [...(booking.entries || []), newEntry]

    // Capture previous status for stats update
    const previousStatus = booking.status

    // Mark as validated only if all entries are used
    const updates: any = {
        entriesCount,
        entries,
        lastValidatedAt: Date.now(),
        lastValidatedBy: adminUid,
    }

    if (entriesCount === totalEntries) {
        updates.status = "validated"
        updates.validatedAt = Date.now()
        updates.validatedBy = adminUid
    }

    await update(ref(db, `bookings/${bookingId}`), updates)

    // Update stats only on FIRST entry or completion
    if (entriesCount === 1) {
        await updateStats("increment", "validatedCount")

        if (previousStatus === "pending") {
            await updateStats("decrement", "pendingCount")
            await updateStats("increment", "totalRevenue", booking.price)
        } else if (previousStatus === "paid") {
            await updateStats("decrement", "paidCount")
        }
    }

    const message = totalEntries > 1
        ? `✅ Entrée ${entriesCount}/${totalEntries} validée !`
        : "✅ Billet validé ! Accès autorisé"

    return {
        success: true,
        message,
        booking: { ...booking, ...updates } as Booking
    }
}

// Cancel booking
export async function cancelBooking(bookingId: string): Promise<boolean> {
    const db = getFirebaseDatabase()
    const booking = await getBooking(bookingId)

    if (!booking) {
        return false
    }

    await update(ref(db, `bookings/${bookingId}`), {
        status: "cancelled",
    })

    return true
}

// ============ STATS OPERATIONS ============

// Get event statistics
export async function getStats(): Promise<Stats> {
    const db = getFirebaseDatabase()
    const snapshot = await get(ref(db, "stats/event_genesis_vol1"))

    if (snapshot.exists()) {
        return snapshot.val() as Stats
    }

    // Return default stats if none exist
    return {
        totalBookings: 0,
        totalRevenue: 0,
        revenueOrange: 0,
        revenueMTN: 0,
        validatedCount: 0,
        pendingCount: 0,
        paidCount: 0,
        lastUpdated: Date.now(),
    }
}

// Update stats (helper function)
async function updateStats(operation: "increment" | "decrement", field: keyof Stats, value: number = 1) {
    const db = getFirebaseDatabase()
    const statsRef = ref(db, "stats/event_genesis_vol1")

    const snapshot = await get(statsRef)
    const currentStats = snapshot.exists() ? snapshot.val() : {
        totalBookings: 0,
        totalRevenue: 0,
        revenueOrange: 0,
        revenueMTN: 0,
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

    await set(statsRef, currentStats)
}

// Update revenue by operator
export async function updateRevenueByOperator(operator: "orange" | "mtn" | "cash", amount: number) {
    const db = getFirebaseDatabase()
    const statsRef = ref(db, "stats/event_genesis_vol1")

    const snapshot = await get(statsRef)
    const currentStats = snapshot.exists() ? snapshot.val() : {
        totalBookings: 0,
        totalRevenue: 0,
        revenueOrange: 0,
        revenueMTN: 0,
        validatedCount: 0,
        pendingCount: 0,
        paidCount: 0,
        lastUpdated: Date.now(),
    }

    if (operator === "orange") {
        currentStats.revenueOrange = (currentStats.revenueOrange || 0) + amount
    } else if (operator === "mtn") {
        currentStats.revenueMTN = (currentStats.revenueMTN || 0) + amount
    }
    currentStats.lastUpdated = Date.now()

    await set(statsRef, currentStats)
}

// Recalculate stats from all bookings (use if stats get out of sync)
export async function recalculateStats(): Promise<Stats> {
    const bookings = await getBookings()

    const stats: Stats = {
        totalBookings: bookings.length,
        totalRevenue: bookings
            .filter(b => b.status === "paid" || b.status === "validated")
            .reduce((sum, b) => sum + b.price, 0),
        revenueOrange: bookings
            .filter(b => (b.status === "paid" || b.status === "validated") && b.operator === "orange")
            .reduce((sum, b) => sum + b.price, 0),
        revenueMTN: bookings
            .filter(b => (b.status === "paid" || b.status === "validated") && b.operator === "mtn")
            .reduce((sum, b) => sum + b.price, 0),
        validatedCount: bookings.filter(b => b.status === "validated").length,
        pendingCount: bookings.filter(b => b.status === "pending").length,
        paidCount: bookings.filter(b => b.status === "paid").length,
        lastUpdated: Date.now(),
    }

    const db = getFirebaseDatabase()
    await set(ref(db, "stats/event_genesis_vol1"), stats)

    return stats
}
