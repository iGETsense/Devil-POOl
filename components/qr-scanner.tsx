"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, X } from "lucide-react"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<string>("")
  const streamRef = useRef<MediaStream | null>(null)
  const scanningRef = useRef<boolean>(true)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" } // Caméra arrière sur mobile
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsScanning(true)
        scanQRCode()
      }
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err)
      setError("Impossible d'accéder à la caméra. Veuillez autoriser l'accès.")
    }
  }

  const stopCamera = () => {
    scanningRef.current = false
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const scanQRCode = () => {
    if (!scanningRef.current || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(scanQRCode)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    
    // Utiliser jsQR pour scanner le QR code
    try {
      if (typeof window !== 'undefined' && window.jsQR) {
        const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        })

        if (code && code.data) {
          // Stocker le contenu scanné dans la variable
          const qrContent = code.data
          setScannedData(qrContent)
          console.log("QR Code scanné:", qrContent)
          
          // Arrêter la caméra et envoyer les données
          stopCamera()
          onScan(qrContent)
          return
        }
      }
    } catch (err) {
      console.error("Erreur de scan:", err)
    }

    if (scanningRef.current) {
      requestAnimationFrame(scanQRCode)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/90 border-b border-[#ff3366]">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-[#ff3366]" />
          <h2 className="text-xl font-bold text-white">Scanner QR Code</h2>
        </div>
        <button
          onClick={() => {
            stopCamera()
            onClose()
          }}
          className="p-2 rounded-full bg-red-900/50 hover:bg-red-900 transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {error ? (
          <div className="text-center p-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-gradient-to-r from-red-900 to-red-700 text-white rounded-full"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="max-w-full max-h-full"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Scanning Frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Corner borders */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#ff3366]"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#ff3366]"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#ff3366]"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#ff3366]"></div>
                
                {/* Scanning line animation */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute w-full h-1 bg-[#ff3366] shadow-lg shadow-[#ff3366]/50 animate-scan"></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="p-6 bg-black/90 border-t border-[#ff3366]">
        <p className="text-white text-center text-lg">
          Placez le QR code dans le cadre pour le scanner
        </p>
      </div>

      {/* Load jsQR library */}
      <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js" async />
    </div>
  )
}
