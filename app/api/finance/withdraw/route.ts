import { NextRequest, NextResponse } from "next/server"
import { MeSomb } from "@/lib/mesomb"
import { verifyIdToken } from "@/lib/firebase-admin"
import { isAuthorizedAdmin } from "@/lib/firebase"

// POST - Withdraw funds
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 })
        }

        const token = authHeader.split("Bearer ")[1]
        const decodedToken = await verifyIdToken(token)

        if (!decodedToken || !isAuthorizedAdmin(decodedToken.uid)) {
            return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 })
        }

        const body = await request.json()
        const { amount, phone, service, password } = body

        if (!amount || !phone || !service) {
            return NextResponse.json({ success: false, message: "Montant, téléphone et service requis" }, { status: 400 })
        }

        // Basic password check (Hardcoded for now as requested for quick access, or relying on Admin Token is safer)
        // User didn't ask for password but it's good practice. 
        // Let's stick to Admin Token security + Optional PIN if implemented.

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
