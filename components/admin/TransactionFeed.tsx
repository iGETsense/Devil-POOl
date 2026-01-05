"use client"

import { Clock, ArrowDownLeft, ArrowUpRight, Smartphone } from "lucide-react"

export interface Transaction {
    id: string
    bookingId: string
    customer: string
    amount: number
    method: "orange" | "mtn" | "cash"
    type: "payment" | "refund"
    status: "success" | "pending" | "failed" | "validated"
    timestamp: number
    transactionId?: string // For verification
}

interface TransactionFeedProps {
    transactions: Transaction[]
    onVerify?: (bookingId: string) => Promise<void>
}

export default function TransactionFeed({ transactions, onVerify }: TransactionFeedProps) {
    if (transactions.length === 0) {
        return (
            <div className="bg-[#1a0a2e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col items-center justify-center text-gray-500">
                <Clock className="w-12 h-12 mb-4 opacity-50" />
                <p>Aucune transaction récente</p>
            </div>
        )
    }

    return (
        <div className="bg-[#1a0a2e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-lg">Transactions en Temps Réel</h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-500 text-xs font-medium uppercase tracking-wider">Live</span>
                </div>
            </div>

            <div className="flex-1 overflow-auto space-y-4 pr-2 custom-scrollbar">
                {transactions.map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">

                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.method === 'orange' ? 'bg-[#ff7900]/20 text-[#ff7900]' :
                                tx.method === 'mtn' ? 'bg-[#ffcc00]/20 text-[#ffcc00]' : 'bg-gray-500/20 text-gray-300'
                                }`}>
                                <Smartphone className="w-6 h-6" />
                            </div>

                            <div>
                                <p className="text-white font-bold">{tx.customer}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="capitalize">{tx.method}</span>
                                    <span>•</span>
                                    <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-1">
                            <p className="text-white font-bold text-lg">
                                {tx.amount.toLocaleString()} XAF
                            </p>

                            {/* Status Badge */}
                            {tx.status === "validated" && (
                                <span className="inline-flex items-center gap-1 text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">
                                    <ArrowDownLeft className="w-3 h-3" /> Validé
                                </span>
                            )}
                            {tx.status === "success" && (
                                <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                                    <ArrowDownLeft className="w-3 h-3" /> Payé
                                </span>
                            )}
                            {tx.status === "pending" && (
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                                        <Clock className="w-3 h-3 animate-spin-slow" /> En cours
                                    </span>
                                    {onVerify && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onVerify(tx.bookingId)
                                            }}
                                            className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded border border-white/5 transition-colors cursor-pointer"
                                        >
                                            Vérifier
                                        </button>
                                    )}
                                </div>
                            )}
                            {tx.status === "failed" && (
                                <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                                    Echec
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
