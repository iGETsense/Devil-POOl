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

    // State for Withdrawal Modal
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [withdrawPhone, setWithdrawPhone] = useState("")
    const [withdrawService, setWithdrawService] = useState<"MTN" | "ORANGE">("MTN")
    const [isWithdrawing, setIsWithdrawing] = useState(false)

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!confirm(`Confirmer le retrait de ${withdrawAmount} FCFA vers ${withdrawPhone} (${withdrawService}) ?`)) return

        setIsWithdrawing(true)
        try {
            // Get current user token if possible, or assume session cookie handles it? 
            // Our API requires Bearer token. We need to get it from auth context or storage.
            // For now, let's assume we store it in localStorage "adminToken" or fetch it.
            // Wait, we don't have a global auth provider exposing token easily here. 
            // Let's use a quick fetch to /api/admin/auth to verify session? No, that returns user info.
            // We usually store token in localStorage or cookies.

            // Hack for prototype: Use the session cookie implicitly? No, API expects Bearer.
            // We need to fetch the token. 
            // If we are logged in, we should have it.

            // Verify authentication
            // We try to use the stored token, but if missing, we proceed relying on cookies.
            const token = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken")

            const headers: any = {
                "Content-Type": "application/json"
            }
            if (token) {
                headers["Authorization"] = `Bearer ${token}`
            }
            // If no token, we hope the cookie handles it (which I just enabled in the API)

            const res = await fetch("/api/finance/withdraw", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    amount: Number(withdrawAmount),
                    phone: withdrawPhone,
                    service: withdrawService
                })
            })

            const result = await res.json()
            if (result.success) {
                alert("Retrait réussi !")
                setIsWithdrawModalOpen(false)
                fetchBalance() // Refresh balance
            } else {
                alert("Erreur: " + result.message)
            }
        } catch (e) {
            alert("Erreur de connexion")
        } finally {
            setIsWithdrawing(false)
        }
    }

    return (
        <div className="h-full flex flex-col relative">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Logs MeSomb</h1>
                    <p className="text-gray-400 text-sm">Vue brute des transactions en temps réel</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Withdraw Button */}
                    <button
                        onClick={() => setIsWithdrawModalOpen(true)}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                    >
                        Retirer Fonds
                    </button>

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
                </div>
            </header>

            <div className="flex-1 min-h-[600px]">
                <LiveMeSombFeed />
            </div>

            {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Retirer des fonds</h2>
                        <form onSubmit={handleWithdraw} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Montant (FCFA)</label>
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={e => setWithdrawAmount(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Numéro (237...)</label>
                                <input
                                    type="tel"
                                    value={withdrawPhone}
                                    onChange={e => setWithdrawPhone(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Service</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setWithdrawService("MTN")}
                                        className={`p-2 rounded-lg border text-sm font-bold ${withdrawService === "MTN" ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" : "bg-black/20 border-white/10 text-gray-500"}`}
                                    >MTN</button>
                                    <button
                                        type="button"
                                        onClick={() => setWithdrawService("ORANGE")}
                                        className={`p-2 rounded-lg border text-sm font-bold ${withdrawService === "ORANGE" ? "bg-orange-500/20 border-orange-500 text-orange-400" : "bg-black/20 border-white/10 text-gray-500"}`}
                                    >ORANGE</button>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsWithdrawModalOpen(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isWithdrawing}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-sm disabled:opacity-50"
                                >
                                    {isWithdrawing ? "..." : "Retirer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
