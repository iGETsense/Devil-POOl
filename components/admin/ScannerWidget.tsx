"use client"

import { Scan, Camera } from "lucide-react"

interface ScannerWidgetProps {
    onActivate: () => void
}

export default function ScannerWidget({ onActivate }: ScannerWidgetProps) {
    return (
        <div className="bg-[#1a0a2e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
            <h3 className="text-white font-bold mb-4">Scanner QR Code</h3>

            {/* Viewfinder Area */}
            <div className="relative aspect-video bg-black/40 rounded-2xl border border-white/5 mb-6 flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent opacity-50 animate-pulse" />

                {/* Tech Corners */}
                <div className="w-48 h-48 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-500 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-500 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500 rounded-br-lg" />

                    {/* Centered Crosshair */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Scan className="w-12 h-12 text-purple-400 opacity-80" />
                    </div>
                </div>
            </div>

            <button
                onClick={onActivate}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl font-bold text-white shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 mb-8"
            >
                <Camera className="w-5 h-5" />
                Activer le Scanner
            </button>

            {/* Recent Scans */}
            <div>
                <h4 className="text-gray-400 text-sm font-bold mb-4">Derniers Scans</h4>
                <div className="space-y-4">
                    {[
                        { name: "Jean Dubois", type: "VIP", status: "success" },
                        { name: "Sophie Martin", type: "Standard", status: "success" },
                        { name: "Lucas Durand", type: "Staff", status: "pending" },
                    ].map((scan, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className={`w-1 h-8 rounded-full ${scan.status === 'success' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                <div>
                                    <p className="text-white text-sm font-medium">{scan.name}</p>
                                    <p className="text-xs text-gray-500">{scan.type}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
