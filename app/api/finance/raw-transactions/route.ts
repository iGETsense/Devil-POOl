import { NextResponse } from "next/server"
import { getTransactions } from "@/lib/database"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const transactions = await getTransactions()
        return NextResponse.json({
            success: true,
            transactions
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}
