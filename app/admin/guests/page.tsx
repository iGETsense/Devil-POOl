"use client"

import { useEffect, useState } from "react"
import GuestList, { Guest } from "@/components/admin/GuestList"
import { Search } from "lucide-react"

export default function GuestsPage() {
    const [guests, setGuests] = useState<Guest[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/guests')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const formatted = data.reservations.map((g: any) => ({
                        id: g.id,
                        name: g.fullName,
                        passType: g.passType === "ONE_MAN" ? "Standard" : g.passType === "ONE_LADY" ? "Lady" : "Queen",
                        status: (g.status === "validated" ? "Validé" : g.status === "paid" ? "Payé" : g.status === "pending" ? "En Attente" : "Annulé")
                    }))
                    setGuests(formatted)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    const filtered = guests.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.passType.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                Gestion des Invités
            </h1>

            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Rechercher par nom ou type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#1a0a2e] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
            </div>

            <div className="h-[600px]">
                {loading ? (
                    <div className="text-white text-center py-20">Chargement...</div>
                ) : (
                    <GuestList guests={filtered} />
                )}
            </div>
        </div>
    )
}
