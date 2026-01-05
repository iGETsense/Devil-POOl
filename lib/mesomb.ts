import { PaymentOperation } from '@hachther/mesomb'

// Env Variables
const APPLICATION_KEY = process.env.MESOMB_APPLICATION_KEY
const ACCESS_KEY = process.env.MESOMB_ACCESS_KEY
const SECRET_KEY = process.env.MESOMB_SECRET_KEY

interface PaymentRequest {
    amount: number
    payer: string // Phone number
    service: "MTN" | "ORANGE"
    reference: string // Booking ID
    description?: string // Description
}

interface PaymentResponse {
    success: boolean
    message: string
    transaction?: any
    status?: "SUCCESS" | "FAILED" | "PENDING"
}

export class MeSomb {

    /**
     * Collect Payment (Deposit)
     */
    static async collect(request: PaymentRequest): Promise<PaymentResponse> {
        if (!APPLICATION_KEY || !ACCESS_KEY || !SECRET_KEY) {
            return { success: false, message: "Server misconfiguration: Missing API Keys" }
        }

        try {
            // Initialize Payment Operation
            const payment = new PaymentOperation({
                applicationKey: APPLICATION_KEY,
                accessKey: ACCESS_KEY,
                secretKey: SECRET_KEY,
            })

            // Prepare Request
            const payer = request.payer.replace("+", "").replace(/\s/g, "")

            console.log("MeSomb: Initiating collection", { amount: request.amount, service: request.service, payer: request.payer })

            // Initiate Collection
            // SDK usage: makeCollect(amount, service, payer, date, nonce, trxID, ...extras)
            const response = await payment.makeCollect({
                amount: request.amount,
                service: request.service,
                payer: payer,
                message: request.description || "Genesis Event Booking",
                reference: request.reference,
            })

            console.log("MeSomb: Collection response received", { success: response.isOperationSuccess(), message: response.message })
            console.log("RAW MESOMB RESPONSE:", JSON.stringify(response, null, 2))

            return {
                success: response.isOperationSuccess(),
                message: response.message || "Request processed",
                transaction: response,
                status: response.isOperationSuccess() ? "PENDING" : "FAILED"
            }

        } catch (error: any) {
            console.error("MeSomb SDK Error:", error)
            return {
                success: false,
                message: error.message || "Payment initiation failed",
                status: "FAILED"
            }
        }
    }

    /**
     * Check Transaction Status
     */
    static async checkStatus(transactionId: string): Promise<PaymentResponse> {
        if (!APPLICATION_KEY || !ACCESS_KEY || !SECRET_KEY) {
            return { success: false, message: "Missing API Keys" }
        }

        try {
            const payment = new PaymentOperation({
                applicationKey: APPLICATION_KEY,
                accessKey: ACCESS_KEY,
                secretKey: SECRET_KEY,
            })

            // Get Status
            // @ts-ignore
            const response = await (payment as any).getTransaction(transactionId)
            console.log("RAW MESOMB CHECK STATUS:", JSON.stringify(response, null, 2))

            return {
                success: true,
                message: response.message,
                status: response.status,
                transaction: response
            }

        } catch (error: any) {
            console.error("MeSomb Status Check Error:", error)
            return {
                success: false,
                message: error.message,
                status: "FAILED"
            }
        }
    }

    /**
     * Get Application Balance
     */
    static async getBalance(): Promise<any> {
        if (!APPLICATION_KEY || !ACCESS_KEY || !SECRET_KEY) {
            return null
        }
        try {
            // NOTE: PaymentOperation.getBalance seems to not exist or is named differently in this version.
            // Temporarily disabling live balance fetch to prevent crashes.
            /*
            const payment = new PaymentOperation({
                applicationKey: APPLICATION_KEY,
                accessKey: ACCESS_KEY,
                secretKey: SECRET_KEY,
            })
            // @ts-ignore
            const bal = await (payment as any).getBalance()
            console.log("RAW MESOMB BALANCE:", JSON.stringify(bal, null, 2))
            return bal
            */
            return null
        } catch (error) {
            console.error("MeSomb Get Balance Error:", error)
            return null
        }
    }
}
