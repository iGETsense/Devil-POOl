"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Calendar, MapPin, Clock, User, Phone, CheckCircle2 } from "lucide-react"
import QRCode from "qrcode"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface BookingData {
  id: string
  fullName: string
  phone: string
  passType: "ONE MAN" | "ONE LADY" | "FIVE QUEENS"
  price: string
  qrCode: string
  bookingDate: string
  eventDate: string
  eventLocation: string
  eventTime: string
}

const PASS_IMAGES = {
  "ONE MAN": "/one-man-neon.png",
  "ONE LADY": "/one-lady-neon.png",
  "FIVE QUEENS": "/five-queens-neon.png"
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const ticketRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        const fullName = searchParams.get("name")
        const phone = searchParams.get("phone")
        const passType = searchParams.get("passType") as "ONE MAN" | "ONE LADY" | "FIVE QUEENS"
        const price = searchParams.get("price")

        if (!fullName || !phone || !passType || !price) {
          router.push("/passes")
          return
        }

        const bookingId = `GEN-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`

        // Use provided booking data
        const data: BookingData = {
          id: bookingId,
          fullName,
          phone,
          passType,
          price,
          qrCode: "",
          bookingDate: new Date().toISOString(),
          eventDate: "30 Novembre 2025",
          eventLocation: "Pool Paradise, Douala",
          eventTime: "20h00 - 04h00"
        }

        // Generate QR
        const qrDataString = JSON.stringify({
          id: data.id,
          name: data.fullName,
          pass: data.passType
        })

        const qrImage = await QRCode.toDataURL(qrDataString, {
          width: 600,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF"
          }
        })

        data.qrCode = qrImage
        setBookingData(data)
        setLoading(false)

      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadBookingData()
  }, [searchParams, router])


  const generatePDF = async () => {
    if (!ticketRef.current || !bookingData) return

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 4, // High resolution for clear text/QR
        useCORS: true,
        backgroundColor: null,
      })

      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [800, 350] // Match exact ticket size
      })

      pdf.addImage(imgData, 'PNG', 0, 0, 800, 350)
      pdf.save(`Genesis-Ticket-${bookingData.id}.pdf`)

    } catch (err) {
      console.error("PDF Generation failed", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050010] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!bookingData) return null

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-[#050010] relative overflow-hidden flex flex-col items-center">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20" />
        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6 border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider" style={{ fontFamily: "var(--font-playfair), serif" }}>
          Réservation Confirmée
        </h1>
        <p className="text-platinum/70 text-lg">
          Votre accès exclusif est prêt. Veuillez télécharger votre ticket.
        </p>
      </div>

      {/* TICKET DISPLAY AREA (What the user sees) */}
      <div className="relative z-10 w-full max-w-5xl flex justify-center mb-12 px-4">
        <div className="w-full max-w-md md:max-w-4xl bg-[#0a0a0a] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-purple-500/30">

          {/* Image Section */}
          <div className="w-full md:w-[300px] h-48 md:h-auto relative shrink-0">
            <Image
              src={PASS_IMAGES[bookingData.passType]}
              alt="Pass"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-purple-900/30 mix-blend-overlay" />

            {/* Mobile Badge Overlay */}
            <div className="md:hidden absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/10">
              <span className="text-white font-mono font-bold text-sm">{bookingData.id}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 md:p-8 flex flex-col relative bg-gradient-to-b md:bg-gradient-to-r from-[#0a0a0a] to-[#1a1a2e]">

            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-start mb-6">
              <div>
                <h2 className="text-neon-purple text-xs font-bold tracking-[0.3em] mb-2 uppercase">Boarding Pass</h2>
                <h1 className="text-white text-3xl font-bold tracking-wider" style={{ fontFamily: "var(--font-playfair), serif" }}>GENESIS VOL.I</h1>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded border border-white/20 h-fit">
                <span className="text-white font-mono font-bold">{bookingData.id}</span>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden mb-6 text-center">
              <h1 className="text-white text-2xl font-bold tracking-wider mb-1" style={{ fontFamily: "var(--font-playfair), serif" }}>GENESIS VOL.I</h1>
              <p className="text-neon-purple text-xs font-bold tracking-[0.3em] uppercase">Boarding Pass</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:flex md:gap-8 gap-y-6 mb-8">
              <div className="col-span-2 md:col-span-1">
                <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider mb-1">Invité</p>
                <p className="text-white font-semibold text-lg">{bookingData.fullName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider mb-1">Pass</p>
                <p className="text-fuchsia-400 font-bold text-lg">{bookingData.passType}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider mb-1">Prix</p>
                <p className="text-white font-semibold text-lg">{bookingData.price}</p>
              </div>
            </div>

            {/* Footer Info & QR */}
            <div className="mt-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
              <div className="space-y-3 w-full md:w-auto">
                <div className="flex items-center gap-3 text-gray-300 text-sm bg-white/5 p-2 rounded-lg md:bg-transparent md:p-0">
                  <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{bookingData.eventDate}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm bg-white/5 p-2 rounded-lg md:bg-transparent md:p-0">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Pool Paradise, Douala</span>
                </div>
              </div>

              {/* QR Display */}
              <div className="bg-white p-3 rounded-xl shadow-lg shrink-0 w-full md:w-auto flex justify-center">
                <img src={bookingData.qrCode} alt="QR" className="w-48 h-48 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HIDDEN PDF SOURCE (The Fixed High-Res Ticket) */}
      <div style={{ position: "absolute", left: "-9999px", top: 0, width: "800px", height: "350px", overflow: "hidden" }}>
        <div
          ref={ticketRef}
          className="w-[800px] h-[350px] bg-[#0a0a0a] flex relative border border-purple-500 overflow-hidden"
        >
          {/* Left: Image (Standard img for html2canvas compatibility) */}
          <div className="w-[30%] h-full relative">
            <img
              src={PASS_IMAGES[bookingData.passType]}
              alt="Pass"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-purple-900/30 mix-blend-overlay" />
          </div>
          {/* Right: Info */}
          <div className="flex-1 p-8 flex flex-col justify-between bg-gradient-to-r from-[#0a0a0a] to-[#1a1a2e]">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-neon-purple text-sm font-bold tracking-[0.3em] mb-2 uppercase">Boarding Pass</h2>
                <h1 className="text-white text-3xl font-bold tracking-wider" style={{ fontFamily: "var(--font-playfair), serif" }}>GENESIS VOL.I</h1>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded border border-white/20">
                <span className="text-white font-mono font-bold">{bookingData.id}</span>
              </div>
            </div>
            <div className="flex gap-8 mt-4">
              <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Invité</p><p className="text-white text-lg font-bold">{bookingData.fullName}</p></div>
              <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Pass</p><p className="text-fuchsia-400 text-lg font-bold">{bookingData.passType}</p></div>
              <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Prix</p><p className="text-white text-lg font-bold">{bookingData.price}</p></div>
            </div>
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <p className="text-gray-300 text-sm flex items-center"><Calendar className="inline w-4 h-4 mr-2" />{bookingData.eventDate}</p>
                <p className="text-gray-300 text-sm flex items-center"><MapPin className="inline w-4 h-4 mr-2" />Pool Paradise</p>
              </div>
              <div className="bg-white p-2 rounded-xl"><img src={bookingData.qrCode} className="w-48 h-48 object-contain" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md md:max-w-none justify-center z-20">
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-full w-full md:w-auto"
        >
          Retour
        </Button>

        <Button
          onClick={generatePDF}
          disabled={loading} // Reuse loading state or add specific valid state check
          className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white px-8 py-6 rounded-full shadow-[0_0_20px_rgba(192,132,252,0.4)] font-bold tracking-wide w-full md:w-auto"
        >
          <Download className="mr-2 h-5 w-5" />
          Télécharger le Billet (PDF)
        </Button>
      </div>

    </main>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Chargement...</div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfirmationContent />
    </Suspense>
  )
}

