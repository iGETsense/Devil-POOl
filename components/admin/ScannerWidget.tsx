"use client"

import { useEffect, useState, useRef } from "react"
import { Scan, Camera, X } from "lucide-react"
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"

export interface ScanResult {
    name: string
    type: string
    status: "success" | "pending" | "error"
    message?: string
    time?: number
}

interface ScannerWidgetProps {
    onScan: (decodedText: string) => Promise<void>
    recentScans: ScanResult[]
    isScanning?: boolean
    setIsScanning?: (isScanning: boolean) => void
}

export default function ScannerWidget({ onScan, recentScans, isScanning: propIsScanning, setIsScanning: propSetIsScanning }: ScannerWidgetProps) {
    const [localIsScanning, setLocalIsScanning] = useState(false)
    const isScanning = propIsScanning !== undefined ? propIsScanning : localIsScanning
    const setIsScanning = propSetIsScanning || setLocalIsScanning

    const scannerRef = useRef<Html5Qrcode | null>(null)
    const [scannerError, setScannerError] = useState<string | null>(null)

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(console.error)
            }
        }
    }, [])

    const startScanner = async () => {
        try {
            setIsScanning(true)
            setScannerError(null)

            const html5QrCode = new Html5Qrcode("reader")
            scannerRef.current = html5QrCode

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
            }

            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                async (decodedText) => {
                    // Success callback
                    console.log("Scanned:", decodedText)
                    await stopScanner() // Stop immediately after scan? Or keep scanning? Let's stop to process.
                    await onScan(decodedText)
                },
                (errorMessage) => {
                    // parse error, ignore
                }
            )

        } catch (err) {
            console.error("Failed to start scanner", err)
            setScannerError("Impossible d'accéder à la caméra")
            setIsScanning(false)
        }
    }

    const stopScanner = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            try {
                await scannerRef.current.stop()
                scannerRef.current.clear()
                setIsScanning(false)
            } catch (err) {
                console.error("Failed to stop scanner", err)
            }
        }
    }

    return (
        <div className="bg-[#1a0a2e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold">Scanner QR Code</h3>
                {isScanning && (
                    <button onClick={stopScanner} className="text-red-400 hover:text-red-300">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Scanner Area */}
            <div className="relative aspect-video bg-black/40 rounded-2xl border border-white/5 mb-6 flex items-center justify-center overflow-hidden group">

                {/* ID for html5-qrcode */}
                <div id="reader" className="w-full h-full"></div>

                {!isScanning && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent opacity-50" />
                        <div className="w-48 h-48 relative">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500 rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-500 rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-500 rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500 rounded-br-lg" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <Scan className="w-12 h-12 text-purple-400 opacity-80" />
                            </div>
                        </div>
                    </>
                )}

                {scannerError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-red-400 p-4 text-center text-sm">
                        {scannerError}
                    </div>
                )}
            </div>

            {!isScanning && (
                <button
                    onClick={startScanner}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl font-bold text-white shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 mb-8"
                >
                    <Camera className="w-5 h-5" />
                    Activer le Scanner
                </button>
            )}

            {isScanning && (
                <div className="w-full py-4 text-center text-purple-300 animate-pulse font-medium mb-8">
                    Recherche de code QR...
                </div>
            )}

            {/* Recent Scans */}
            <div className="flex-1 overflow-auto max-h-[200px] scrollbar-hide">
                <h4 className="text-gray-400 text-sm font-bold mb-4 sticky top-0 bg-[#0e051a] py-2 z-10">Derniers Scans</h4>
                <div className="space-y-4">
                    {recentScans.length === 0 && (
                        <p className="text-gray-600 text-xs italic">Aucun scan récent</p>
                    )}
                    {recentScans.map((scan, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-lg border border-white/5 transition-all
                            ${scan.status === 'success' ? 'bg-green-500/10 border-green-500/20' :
                                scan.status === 'error' ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5'}
                        `}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-1 h-8 rounded-full flex-shrink-0 
                                    ${scan.status === 'success' ? 'bg-green-500' :
                                        scan.status === 'error' ? 'bg-red-500' : 'bg-gray-500'}`}
                                />
                                <div className="min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{scan.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{scan.message || scan.type}</p>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-500 flex-shrink-0">
                                {scan.time ? new Date(scan.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
