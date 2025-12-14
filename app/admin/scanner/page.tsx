"use client"

import { useEffect, useState, useRef } from "react"
import { scan } from "rxjs"
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"
import { X, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function ScannerPage() {
    const [isScanning, setIsScanning] = useState(false)
    const [result, setResult] = useState<{ status: 'success' | 'error', message: string, detail?: any } | null>(null)
    const scannerRef = useRef<Html5Qrcode | null>(null)

    // Start scanner on mount or when reset
    const startScanner = async () => {
        try {
            if (scannerRef.current?.isScanning) {
                await scannerRef.current.stop()
            }

            const html5QrCode = new Html5Qrcode("reader-fs")
            scannerRef.current = html5QrCode

            setIsScanning(true)
            setResult(null)

            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 280, height: 280 }, // Tights square like Telegram
                    aspectRatio: 1.0,
                    // Telegram logic: fits width, square box
                },
                async (decodedText) => {
                    await handleScan(decodedText)
                },
                (errorMessage) => {
                    // ignore errors
                }
            )
        } catch (err) {
            console.error(err)
            toast.error("Impossible d'accéder à la caméra")
        }
    }

    const handleScan = async (qrCode: string) => {
        if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop()
            setIsScanning(false)
        }

        // Processing UI
        toast.promise(
            processCode(qrCode),
            {
                loading: 'Vérification...',
                success: (data) => {
                    setResult({ status: 'success', message: 'Validé !', detail: data.booking })
                    return data.message
                },
                error: (data) => {
                    setResult({ status: 'error', message: data.message || 'Erreur' })
                    return data.message
                }
            }
        )
    }

    const processCode = async (qrCode: string) => {
        const res = await fetch('/api/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ qrCode })
        })
        const data = await res.json()
        if (!data.success) throw data
        return data
    }

    useEffect(() => {
        // Start automatically
        startScanner()
        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop()
            }
        }
    }, [])

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center p-4">

            {/* Main Scanner Container with Telegram-like styling */}
            <div className="relative w-full max-w-md aspect-[9/16] max-h-[600px] bg-black rounded-[32px] overflow-hidden shadow-2xl border-4 border-[#1a0a2e] flex flex-col relative">

                {/* Result Overlay */}
                {result && (
                    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-8 text-center bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-300`}>
                        {result.status === 'success' ? (
                            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 ring-4 ring-green-500/50 animate-bounce">
                                <CheckCircle className="w-12 h-12 text-green-400" />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6 ring-4 ring-red-500/50 animate-shake">
                                <AlertCircle className="w-12 h-12 text-red-400" />
                            </div>
                        )}

                        <h2 className={`text-3xl font-bold mb-2 ${result.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {result.message}
                        </h2>

                        {result.detail && (
                            <div className="bg-white/10 rounded-xl p-4 w-full mb-6">
                                <p className="text-white text-lg font-bold">{result.detail.fullName}</p>
                                <p className="text-gray-400 uppercase tracking-widest text-sm">{result.detail.passType}</p>
                            </div>
                        )}

                        <button
                            onClick={startScanner}
                            className="bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Scanner à nouveau
                        </button>
                    </div>
                )}

                {/* Camera View */}
                <div id="reader-fs" className="w-full h-full object-cover"></div>

                {/* Overlay UI (Telegram Style) */}
                {!result && isScanning && (
                    <div className="absolute inset-0 z-40 pointer-events-none">
                        <div className="absolute inset-0 flex flex-col">
                            <div className="flex-1 bg-black/60 backdrop-blur-[2px]"></div>
                            <div className="flex h-[280px]">
                                <div className="flex-1 bg-black/60 backdrop-blur-[2px]"></div>
                                {/* Clear center area */}
                                <div className="w-[280px] relative">
                                    {/* Corner Markers - White, Thicker */}
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-[5px] border-l-[5px] border-white rounded-tl-[8px]"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-[5px] border-r-[5px] border-white rounded-tr-[8px]"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[5px] border-l-[5px] border-white rounded-bl-[8px]"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[5px] border-r-[5px] border-white rounded-br-[8px]"></div>

                                    {/* Telegram Style Scan Line Animation */}
                                    <div className="animate-scan-telegram"></div>
                                </div>
                                <div className="flex-1 bg-black/60 backdrop-blur-[2px]"></div>
                            </div>
                            <div className="flex-1 bg-black/60 backdrop-blur-[2px] flex items-start justify-center pt-8">
                                <div className="bg-black/50 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
                                    <p className="text-white font-bold text-sm">
                                        Scan QR Code
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
