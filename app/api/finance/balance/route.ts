import { NextResponse } from "next/server"
import { MeSomb } from "@/lib/mesomb"

export async function GET() {
    try {
        const balance = await MeSomb.getBalance()
        return NextResponse.json({
            success: true,
            balance: balance
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}
