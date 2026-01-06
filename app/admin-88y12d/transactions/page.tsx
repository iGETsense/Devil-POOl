"use client"

import { useEffect, useState } from "react"
import LiveMeSombFeed from "@/components/admin/LiveMeSombFeed"
import { Wallet, RefreshCw } from "lucide-react"

export default function TransactionsPage() {
    const [balance, setBalance] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchBalance = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/finance/balance')
            const data = await res.json()
            if (data.success) {
                // Parse balance similar to dashboard logic
                let total = 0
                const b = data.balance
                if (Array.isArray(b)) {
                    total = b.reduce((acc: number, curr: any) => acc + (parseFloat(curr.balance) || 0), 0)
                } else if (typeof b === 'object' && b !== null) {
                    const values = Object.values(b)
                    if (values.length > 0) {
                        values.forEach((val: any) => {
                            if (typeof val === 'number') total += val
                            else if (typeof val === 'string') total += parseFloat(val)
                        })
                    }
                } else {
                    total = Number(b) || 0
                }
                setBalance(total)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBalance()
    }, [])

    return (
        <div className="h-full flex flex-col">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Logs MeSomb</h1>
                    <p className="text-gray-400 text-sm">Vue brute des transactions en temps réel</p>
                </div>

                {/* Real Balance Card */}
                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 p-4 rounded-2xl flex items-center gap-4 min-w-[250px]">
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-blue-200 font-medium mb-1">Solde Réel (MeSomb)</p>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-white">
                                {balance !== null ? `${balance.toLocaleString()} FCFA` : "..."}
                            </h2>
                            <button onClick={fetchBalance} className={`text-white/20 hover:text-white ${loading ? "animate-spin" : ""}`}>
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 min-h-[600px]">
                <LiveMeSombFeed />
            </div>
        </div>
    )
}
