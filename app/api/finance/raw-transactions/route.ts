import { NextResponse } from "next/server"
import { getTransactions } from "@/lib/database"
import { getRecentTransactions } from "@/lib/mesomb-direct"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Fetch valid bookings from DB
        const dbTransactions = await getTransactions()

        // Fetch raw logs from MeSomb
        const mesombResult = await getRecentTransactions(20)
        let rawLogs: any[] = []

        if (mesombResult.success) {
            rawLogs = mesombResult.transactions.map((tx: any) => ({
                id: tx.pk,
                bookingId: tx.reference || "N/A",
                amount: parseFloat(tx.amount),
                status: tx.status,
                message: tx.type === 'DEPOSIT' ? 'Retrait (Deposit)' : 'Paiement',
                createdAt: new Date(tx.date).getTime(),
                updatedAt: new Date(tx.date).getTime(),
                rawResponse: tx
            }))
        }

        // Merge strategies? For now, let's just return the raw MeSomb logs since that's what the user wants "History"
        // Or if dbTransactions is empty, valid fall back.
        // The component expects "TransactionLog" shape.

        return NextResponse.json({
            success: true,
            transactions: rawLogs.length > 0 ? rawLogs : dbTransactions
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}
