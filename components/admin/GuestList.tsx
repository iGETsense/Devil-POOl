"use client"

import { useState } from "react"
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"

export interface Guest {
    id: string
    name: string
    passType: string
    status: "Validé" | "En Attente" | "Refusé" | "Payé"
    entriesCount?: number
    totalEntries?: number
}

interface GuestListProps {
    guests?: Guest[]
}

const ITEMS_PER_PAGE = 8

export default function GuestList({ guests = [] }: GuestListProps) {
    const [currentPage, setCurrentPage] = useState(1)

    // Use guests prop directly
    const allGuests = guests

    const totalPages = Math.ceil(allGuests.length / ITEMS_PER_PAGE)

    // Reset to page 1 if data changes significantly (optional, but good practice if searching reduces count)
    // For now we'll just handle out of bounds in slice, but usually useEffect is needed.
    // Simpler: ensure currentPage is valid.
    const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages))

    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE
    const displayGuests = allGuests.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
                <h3 className="text-white font-bold">Liste des Invités ({allGuests.length})</h3>
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
                        {displayGuests.length > 0 ? (
                            displayGuests.map((guest, i) => (
                                <tr key={i} className="group border-b border-white/5 hover:bg-white/5 transition-colors animate-in slide-in-from-bottom-2 fade-in duration-500 fill-mode-backwards" style={{ animationDelay: `${i * 50}ms` }}>
                                    <td className="p-3">
                                        <span className="text-white font-medium block p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-purple-500/30 transition-colors">
                                            {guest.name}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-400 pl-4">{guest.passType}</td>
                                    <td className="p-3 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(guest.status)}`}>
                                                {guest.status}
                                            </span>
                                            {guest.totalEntries && guest.totalEntries > 1 && (
                                                <span className="text-[10px] text-gray-500 font-mono">
                                                    {guest.entriesCount || 0}/{guest.totalEntries} Entrées
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-gray-500 italic">
                                    Aucun invité trouvé
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                    <span className="text-xs text-gray-500">
                        Page {validCurrentPage} sur {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={validCurrentPage === 1}
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={validCurrentPage === totalPages}
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
