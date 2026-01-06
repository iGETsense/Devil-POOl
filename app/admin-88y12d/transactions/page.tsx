"use client"

import { useEffect, useState } from "react"
import LiveMeSombFeed from "@/components/admin/LiveMeSombFeed"
import { Wallet, RefreshCw } from "lucide-react"
import { toast } from "sonner"

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

        // Basic Validation
        if (!withdrawAmount || Number(withdrawAmount) < 50) {
            toast.error("Le montant minimum est de 50 FCFA")
            return
        }
        if (!withdrawPhone || withdrawPhone.length < 9) {
            toast.error("Numéro de téléphone invalide")
            return
        }

        if (!confirm(`Confirmer le retrait de ${Number(withdrawAmount).toLocaleString()} FCFA vers ${withdrawPhone} (${withdrawService}) ?`)) return

        setIsWithdrawing(true)
        const toastId = toast.loading("Traitement du retrait...")

        try {
            // Verify authentication
            // We try to use the stored token, but if missing, we proceed relying on cookies.
            const token = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken")

            const headers: any = {
                "Content-Type": "application/json"
            }
            if (token) {
                headers["Authorization"] = `Bearer ${token}`
            }

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
                toast.success("Retrait effectué avec succès !", { id: toastId })
                setIsWithdrawModalOpen(false)
                setWithdrawAmount("")
                setWithdrawPhone("")
                fetchBalance() // Refresh balance
            } else {
                toast.error(`Erreur: ${result.message}`, { id: toastId })
            }
        } catch (e) {
            console.error(e)
            toast.error("Erreur de connexion impossible de joindre le serveur", { id: toastId })
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
                        className="bg-gradient-to-r from-red-900/40 to-red-600/20 hover:from-red-800/60 hover:to-red-500/30 border border-red-500/50 text-red-200 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:scale-105"
                    >
                        <Wallet className="w-4 h-4" />
                        Retirer Fonds
                    </button>

                    {/* Real Balance Card */}
                    <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 p-4 rounded-2xl flex items-center gap-4 min-w-[250px] backdrop-blur-md">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 shadow-inner">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-200 font-medium mb-1 uppercase tracking-wider">Solde Réel (MeSomb)</p>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                                    {balance !== null ? `${balance.toLocaleString()} FCFA` : "..."}
                                </h2>
                                <button onClick={fetchBalance} className={`text-white/20 hover:text-white transition-colors ${loading ? "animate-spin" : ""}`}>
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 min-h-[600px] border border-white/5 rounded-3xl overflow-hidden bg-black/20 backdrop-blur-sm">
                <LiveMeSombFeed />
            </div>

            {/* Premium Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop with blur and darken */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => !isWithdrawing && setIsWithdrawModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-[#1a1a2e] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">

                        {/* Radioactive Glow Effect */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-red-600/20 rounded-full blur-[50px]"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-blue-600/20 rounded-full blur-[50px]"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold text-white mb-1">Retrait de Fonds</h2>
                            <p className="text-gray-400 text-sm mb-6">Transférez de l'argent vers un compte mobile.</p>

                            <form onSubmit={handleWithdraw} className="space-y-5">

                                {/* Amount Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Montant (FCFA)</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors">
                                            <Wallet className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="number"
                                            value={withdrawAmount}
                                            onChange={e => setWithdrawAmount(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 focus:border-white/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 outline-none transition-all focus:bg-black/60 shadow-inner"
                                            placeholder="Ex: 50000"
                                            required
                                            min="100"
                                        />
                                    </div>
                                </div>

                                {/* Phone Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Numéro Bénéficiaire (237...)</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors">
                                            <span className="text-xs font-bold">#</span>
                                        </div>
                                        <input
                                            type="tel"
                                            value={withdrawPhone}
                                            onChange={e => setWithdrawPhone(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 focus:border-white/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 outline-none transition-all focus:bg-black/60 shadow-inner"
                                            placeholder="6XXXXXXXX"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Service Selection */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Opérateur</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setWithdrawService("MTN")}
                                            className={`relative overflow-hidden p-3 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 group ${withdrawService === "MTN"
                                                ? "bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                                                : "bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/30"}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${withdrawService === "MTN" ? "bg-yellow-400" : "bg-gray-600"}`}></div>
                                            <span className={`text-sm font-bold ${withdrawService === "MTN" ? "text-yellow-400" : "text-gray-400"}`}>MTN</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setWithdrawService("ORANGE")}
                                            className={`relative overflow-hidden p-3 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 group ${withdrawService === "ORANGE"
                                                ? "bg-orange-500/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                                                : "bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/30"}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${withdrawService === "ORANGE" ? "bg-orange-400" : "bg-gray-600"}`}></div>
                                            <span className={`text-sm font-bold ${withdrawService === "ORANGE" ? "text-orange-400" : "text-gray-400"}`}>ORANGE</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsWithdrawModalOpen(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white py-3 rounded-xl text-sm font-medium transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isWithdrawing}
                                        className="flex-[2] bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl text-sm transition-all hover:scale-[1.02] shadow-lg shadow-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isWithdrawing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Traitement...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Confirmer le Retrait</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
