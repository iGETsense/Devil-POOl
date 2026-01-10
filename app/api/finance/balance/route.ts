import { NextResponse } from "next/server"
import { getAccountBalance } from "@/lib/mesomb-direct"

export async function GET() {
    try {
        const result = await getAccountBalance()

        return NextResponse.json({
            success: result.success,
            balance: result.balance, // Direct parsed total
            balances: result.balances, // breakdown if needed
            message: result.error // Forward error message
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}

