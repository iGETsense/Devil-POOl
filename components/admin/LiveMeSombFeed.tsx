"use client"

import { useEffect, useState } from "react"
import { Activity, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"

interface TransactionLog {
    id: string
    bookingId: string
    amount: number
    status: "PENDING" | "SUCCESS" | "FAILED"
    message?: string
    createdAt: number
    updatedAt: number
    rawResponse?: any
}

export default function LiveMeSombFeed() {
    const [logs, setLogs] = useState<TransactionLog[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/finance/raw-transactions')
            const data = await res.json()
            if (data.success) {
                setLogs(data.transactions)
            }
        } catch (error) {
            console.error("Failed to fetch logs")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
        // Poll every 5 seconds for live feel
        const interval = setInterval(fetchLogs, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-[#1a0a2e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-neon-purple animate-pulse" />
                    <h3 className="text-white font-bold">MeSomb Live Feed</h3>
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Temps Réel</span>
            </div>

            <div className="flex-1 overflow-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
                {logs.map((log) => {
                    let statusColor = "text-yellow-400"
                    let StatusIcon = Clock
                    let bgColor = "bg-yellow-400/10 border-yellow-400/20"

                    if (log.status === "SUCCESS") {
                        statusColor = "text-green-400"
                        StatusIcon = CheckCircle
                        bgColor = "bg-green-400/10 border-green-400/20"
                    } else if (log.status === "FAILED") {
                        statusColor = "text-red-400"
                        StatusIcon = XCircle
                        bgColor = "bg-red-400/10 border-red-400/20"
                    }

                    // Try to extract extra info
                    const payer = log.rawResponse?.payer || log.rawResponse?.b_party || "Anonyme"

                    return (
                        <div key={log.id} className={`p-3 rounded-xl border ${bgColor} flex flex-col gap-1 transition-all hover:bg-opacity-20`}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                                    <span className={`text-xs font-bold ${statusColor}`}>{log.status}</span>
                                </div>
                                <span className="text-[10px] text-gray-500 font-mono">
                                    {new Date(log.createdAt).toLocaleTimeString()}
                                </span>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-white text-xs font-medium">Ref: {log.id.substring(0, 8)}...</p>
                                    <p className="text-gray-400 text-[10px]">Client: {payer}</p>
                                </div>
                                <span className="text-white font-bold text-sm">
                                    {log.amount} XAF
                                </span>
                            </div>

                            {log.message && (
                                <p className="text-[10px] text-gray-400 mt-1 italic border-t border-white/5 pt-1">
                                    Note: {log.message}
                                </p>
                            )}
                        </div>
                    )
                })}

                {logs.length === 0 && !loading && (
                    <div className="text-center text-gray-500 py-10">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-xs">Aucun log brut disponible</p>
                    </div>
                )}
            </div>
        </div>
    )
}
