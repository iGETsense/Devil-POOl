import { NextRequest, NextResponse } from "next/server"
import { makeWithdrawal } from "@/lib/mesomb-direct"
import crypto from 'crypto'

// POST - Withdraw funds
export async function POST(request: NextRequest) {
    try {
        console.warn("⚠️ WITHDRAWAL AUTHENTICATION DISABLED - PROCEEDING WITHOUT CHECKS")

        const body = await request.json()
        const { amount, phone, service } = body

        if (!amount || !phone || !service) {
            return NextResponse.json({ success: false, message: "Montant, téléphone et service requis" }, { status: 400 })
        }

        // Initiate Withdrawal
        const nonce = crypto.randomBytes(16).toString('hex')
        const receiver = phone.replace("+", "").replace(/\s/g, "")

        const result = await makeWithdrawal({
            amount: Number(amount),
            receiver: receiver,
            service: service,
            nonce: nonce,
        })

        if (!result.success) {
            // Forward the exact error from MeSomb
            return NextResponse.json({ success: false, message: result.error || result.message || "Unknown Error" }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: "Retrait effectué avec succès",
            transaction: result.reference
        })

    } catch (error: any) {
        console.error("Withdraw Error:", error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
