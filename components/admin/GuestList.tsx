"use client"

import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"

export interface Guest {
    id: string
    name: string
    passType: string
    status: "Validé" | "En Attente" | "Refusé" | "Payé"
}

interface GuestListProps {
    guests?: Guest[]
}

export default function GuestList({ guests = [] }: GuestListProps) {
    // Mock data if none provided, to match image
    const displayGuests = guests.length > 0 ? guests : [
        { id: "1", name: "Claire Fontaine", passType: "VIP Gold", status: "Validé" },
        { id: "2", name: "Thomas Moreau", passType: "Standard", status: "En Attente" },
        { id: "3", name: "Émilie Roux", passType: "Staff", status: "Validé" },
        { id: "4", name: "Alexandre Petit", passType: "VIP", status: "En Attente" },
        { id: "5", name: "Sarah Bernard", passType: "Standard", status: "Validé" },
    ]

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Validé": return "bg-purple-500/20 text-purple-300 border border-purple-500/30"
            case "En Attente": return "bg-gray-700/30 text-gray-400 border border-gray-600/30"
            case "Payé": return "bg-green-500/20 text-green-300 border border-green-500/30"
            default: return "bg-red-500/20 text-red-300"
        }
    }

    return (
        <div className="bg-[#1a0a2e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold">Liste des Invités</h3>
                <button className="text-gray-400 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-500 uppercase border-b border-white/5">
                            <th className="font-medium p-3">Nom</th>
                            <th className="font-medium p-3">Type de Pass</th>
                            <th className="font-medium p-3 text-right">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {displayGuests.map((guest, i) => (
                            <tr key={i} className="group border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-3">
                                    <span className="text-white font-medium block p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-purple-500/30 transition-colors">
                                        {guest.name}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-400 pl-4">{guest.passType}</td>
                                <td className="p-3 text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(guest.status)}`}>
                                        {guest.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
                <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
