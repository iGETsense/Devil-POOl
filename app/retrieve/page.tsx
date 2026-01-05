"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Ticket, ArrowRight, Home } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RetrievePage() {
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [tickets, setTickets] = useState<any[]>([])
    const router = useRouter()

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setTickets([])

        try {
            const res = await fetch("/api/tickets/retrieve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone })
            })
            const data = await res.json()

            if (!data.success) {
                throw new Error(data.message)
            }

            if (!data.found || data.bookings.length === 0) {
                setError("Aucun billet trouvé pour ce numéro.")
            } else {
                setTickets(data.bookings)
            }

        } catch (err: any) {
            setError(err.message || "Erreur lors de la recherche")
        } finally {
            setLoading(false)
        }
    }

    const formatPhone = (val: string) => {
        // Simple formatter
        return val
    }

    return (
        <main className="min-h-screen bg-[#050010] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20" />
                <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="z-10 w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair), serif" }}>
                        Mes Billets
                    </h1>
                    <p className="text-gray-400">Retrouvez vos accès perdus</p>
                </div>

                <Card className="bg-[#1a1a2e]/80 backdrop-blur border-white/10 shadow-2xl">
                    <CardContent className="p-6 space-y-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Numéro de téléphone</label>
                                <div className="relative">
                                    <Input
                                        type="tel"
                                        placeholder="Ex: 699..."
                                        className="bg-black/50 border-white/10 text-white pl-10 h-12"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg font-semibold"
                                disabled={loading}
                            >
                                {loading ? "Recherche..." : "Rechercher mes billets"}
                            </Button>
                        </form>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results List */}
                {tickets.length > 0 && (
                    <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
                        <p className="text-white text-center mb-2">{tickets.length} Billet(s) trouvé(s)</p>
                        {tickets.map((ticket) => (
                            <div key={ticket.id} onClick={() => router.push(`/confirmation?bookingId=${ticket.id}&name=${encodeURIComponent(ticket.fullName)}&phone=${encodeURIComponent(ticket.phone)}&passType=${encodeURIComponent(ticket.passType)}&price=${ticket.price}`)}
                                className="bg-[#1a1a2e] border border-purple-500/30 p-4 rounded-xl flex items-center justify-between hover:bg-purple-900/20 cursor-pointer transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-purple-500/20 p-3 rounded-full">
                                        <Ticket className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">{ticket.passType}</h3>
                                        <p className="text-gray-400 text-sm">{ticket.fullName}</p>
                                        <p className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-center">
                    <Button variant="link" className="text-gray-400 hover:text-white" onClick={() => router.push("/")}>
                        <Home className="w-4 h-4 mr-2" /> Retour à l'accueil
                    </Button>
                </div>
            </div>
        </main>
    )
}
