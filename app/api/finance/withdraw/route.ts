import { NextRequest, NextResponse } from "next/server"
import { MeSomb } from "@/lib/mesomb"
import { verifyIdToken } from "@/lib/firebase-admin"
import { isAuthorizedAdmin } from "@/lib/firebase"

// POST - Withdraw funds
export async function POST(request: NextRequest) {
    try {
        let token = ""

        // 1. Check Bearer Token
        // AUTHENTICATION DISABLED AS REQUESTED BY USER
        // For production, uncomment the auth verification below.
        /*
        let decodedToken = await verifyIdToken(token) 
        // ... (previous auth logic)
        if (!decodedToken || !isAuthorizedAdmin(decodedToken.uid)) {
             return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 })
        }
        */
        console.warn("⚠️ WITHDRAWAL AUTHENTICATION DISABLED - PROCEEDING WITHOUT CHECKS")

        const body = await request.json()
        const { amount, phone, service } = body

        if (!amount || !phone || !service) {
            return NextResponse.json({ success: false, message: "Montant, téléphone et service requis" }, { status: 400 })
        }

        // Initiate Withdrawal
        const result = await MeSomb.deposit({
            amount: Number(amount),
            payer: phone, // In deposit context, this is receiver
            service: service,
            reference: `WITHDRAW-${Date.now()}`,
            description: "Admin Withdrawal"
        })

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: "Retrait effectué avec succès",
            transaction: result.transaction
        })

    } catch (error: any) {
        console.error("Withdraw Error:", error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
