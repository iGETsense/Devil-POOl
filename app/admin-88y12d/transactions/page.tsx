"use client"

import { useEffect, useState } from "react"
import LiveMeSombFeed from "@/components/admin/LiveMeSombFeed"
import { Wallet, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function TransactionsPage() {
    const [balance, setBalance] = useState<number | null>(null)
    const [balanceMTN, setBalanceMTN] = useState<number>(0)
    const [balanceOrange, setBalanceOrange] = useState<number>(0)
    const [loading, setLoading] = useState(false)

    const fetchBalance = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/finance/balance')
            const data = await res.json()
            if (data.success) {
                // Direct implementation returns 'balance' as number already
                const total = typeof data.balance === 'number' ? data.balance : 0
                setBalance(total)

                // Sub-balances
                if (Array.isArray(data.balances)) {
                    const mtn = data.balances.find((b: any) => b.service === 'MTN')?.value || 0
                    const orange = data.balances.find((b: any) => b.service === 'ORANGE')?.value || 0
                    setBalanceMTN(mtn)
                    setBalanceOrange(orange)
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    // Auto-refresh balance every 15 seconds
    useEffect(() => {
        fetchBalance()
        const interval = setInterval(fetchBalance, 15000)
        return () => clearInterval(interval)
    }, [])

    // State for Withdrawal Modal
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [withdrawPhone, setWithdrawPhone] = useState("")
    const [withdrawService, setWithdrawService] = useState<"MTN" | "ORANGE">("MTN")
    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const [step, setStep] = useState(1) // 1 = Input, 2 = Confirm
    const [errors, setErrors] = useState({ amount: "", phone: "" })

    const resetModal = () => {
        setIsWithdrawModalOpen(false)
        setStep(1)
        setWithdrawAmount("")
        setWithdrawPhone("")
        setErrors({ amount: "", phone: "" })
    }

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors = { amount: "", phone: "" }
        let hasError = false

        // Basic Validation
        if (!withdrawAmount || Number(withdrawAmount) < 50) {
            newErrors.amount = "Le montant minimum est de 50 FCFA"
            hasError = true
        }
        if (!withdrawPhone || withdrawPhone.length < 9) {
            newErrors.phone = "Numéro de téléphone invalide (min 9 chiffres)"
            hasError = true
        }

        if (hasError) {
            setErrors(newErrors)
            return
        }

        setErrors({ amount: "", phone: "" })
        setStep(2)
    }

    const handleConfirmWithdraw = async () => {
        setIsWithdrawing(true)

        // Remove toast.loading to allow better error visibility, or use it but update it carefully
        const toastId = toast.loading("Traitement du retrait...")

        try {
            // Verify authentication
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
                resetModal()
                fetchBalance() // Refresh balance
            } else {
                // Show interactive error
                // The API now returns precise MeSomb error (e.g., "Insufficient balance")
                toast.error(
                    <div className="flex flex-col gap-1">
                        <span className="font-bold">Échec du retrait</span>
                        <span className="text-xs">{result.message}</span>
                    </div>
                    , { id: toastId, duration: 6000 })
            }
        } catch (e) {
            console.error(e)
            toast.error("Erreur de connexion impossible de joindre le serveur", { id: toastId })
        } finally {
            setIsWithdrawing(false)
        }
    }

    return (
        <div className="h-full flex flex-col relative animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                    <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 p-4 rounded-2xl flex items-center gap-4 min-w-[250px] backdrop-blur-md hover:border-purple-500/30 transition-colors">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 shadow-inner">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-200 font-bold mb-1 uppercase tracking-wider">Solde Réel (MeSomb)</p>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-white drop-shadow-md font-mono tracking-tight">
                                    {balance !== null ? `${balance.toLocaleString()} FCFA` : "..."}
                                </h2>
                                <button onClick={fetchBalance} className={`text-white/20 hover:text-white transition-colors ${loading ? "animate-spin" : ""}`}>
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                            {/* Breakdown */}
                            <div className="mt-2 flex gap-4 text-[10px] font-mono border-t border-white/10 pt-2">
                                <span className="text-orange-400 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                                    <span className="font-bold">ORANGE:</span> {balanceOrange?.toLocaleString() ?? 0}
                                </span>
                                <span className="text-yellow-400 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></span>
                                    <span className="font-bold">MTN:</span> {balanceMTN?.toLocaleString() ?? 0}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 min-h-[600px] border border-white/5 rounded-3xl overflow-hidden bg-black/20 backdrop-blur-sm">
                <LiveMeSombFeed />
            </div>

            {/* Premium Withdraw Modal */}
            {
                isWithdrawModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop with blur and darken */}
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
                            onClick={() => !isWithdrawing && resetModal()}
                        ></div>

                        {/* Modal Content */}
                        <div className="relative bg-[#1a1a2e] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">

                            {/* Radioactive Glow Effect */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-red-600/20 rounded-full blur-[50px]"></div>
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-blue-600/20 rounded-full blur-[50px]"></div>

                            <div className="relative z-10">
                                {step === 1 ? (
                                    <>
                                        <h2 className="text-2xl font-bold text-white mb-1">Retrait de Fonds</h2>
                                        <p className="text-gray-400 text-sm mb-6">Transférez de l'argent vers un compte mobile.</p>

                                        <form onSubmit={handleNextStep} className="space-y-5">

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
                                                        onChange={e => {
                                                            setWithdrawAmount(e.target.value)
                                                            if (errors.amount) setErrors(prev => ({ ...prev, amount: "" }))
                                                        }}
                                                        className={`w-full bg-black/40 border ${errors.amount ? "border-red-500/50" : "border-white/10"} focus:border-white/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 outline-none transition-all focus:bg-black/60 shadow-inner`}
                                                        placeholder="Ex: 50000"
                                                        required
                                                        min="50"
                                                    />
                                                </div>
                                                {errors.amount && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.amount}</p>}
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
                                                        onChange={e => {
                                                            setWithdrawPhone(e.target.value)
                                                            if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }))
                                                        }}
                                                        className={`w-full bg-black/40 border ${errors.phone ? "border-red-500/50" : "border-white/10"} focus:border-white/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 outline-none transition-all focus:bg-black/60 shadow-inner`}
                                                        placeholder="6XXXXXXXX"
                                                        required
                                                    />
                                                </div>
                                                {errors.phone && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.phone}</p>}
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
                                                    onClick={resetModal}
                                                    className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white py-3 rounded-xl text-sm font-medium transition-colors"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-[2] bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-xl text-sm transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    Suivant
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">Confirmer le Retrait</h2>
                                            <p className="text-gray-400 text-sm">Vérifiez les détails avant de valider.</p>
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                                <span className="text-gray-400 text-sm">Montant</span>
                                                <span className="text-2xl font-bold text-white tracking-tight">{Number(withdrawAmount).toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA</span></span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 text-sm">Bénéficiaire</span>
                                                <span className="text-white font-mono bg-black/30 px-2 py-1 rounded-lg">{withdrawPhone}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 text-sm">Opérateur</span>
                                                <span className={`font-bold ${withdrawService === "MTN" ? "text-yellow-400" : "text-orange-400"}`}>{withdrawService}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                disabled={isWithdrawing}
                                                onClick={() => setStep(1)}
                                                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white py-3 rounded-xl text-sm font-medium transition-colors"
                                            >
                                                Retour
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleConfirmWithdraw}
                                                disabled={isWithdrawing}
                                                className="flex-[2] bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl text-sm transition-all hover:scale-[1.02] shadow-lg shadow-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isWithdrawing ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        <span>Traitement...</span>
                                                    </>
                                                ) : (
                                                    "Confirmer"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
