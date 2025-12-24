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
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const ticketsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        const phone = searchParams.get("phone")
        const passType = searchParams.get("passType") as "ONE MAN" | "ONE LADY" | "FIVE QUEENS"
        const price = searchParams.get("price")

        if (!phone || !passType || !price) {
          router.push("/passes")
          return
        }

        const bookingIdsParam = searchParams.get("bookingIds")
        const namesParam = searchParams.get("names")
        const singleBookingId = searchParams.get("bookingId")
        const singleName = searchParams.get("name")

        const newBookings: BookingData[] = []

        if (bookingIdsParam && namesParam) {
          // Multiple Bookings (Five Queens)
          const ids = bookingIdsParam.split(",")
          const names = namesParam.split(",")

          for (let i = 0; i < ids.length; i++) {
            const id = ids[i]
            const name = names[i] || "Invité"

            const qrDataString = `GENESIS-${id}`
            const qrImage = await QRCode.toDataURL(qrDataString, {
              width: 600,
              margin: 2,
              color: { dark: "#000000", light: "#FFFFFF" }
            })

            newBookings.push({
              id,
              fullName: name,
              phone,
              passType,
              price, // Price per ticket (calculated in backend or passed here)
              qrCode: qrImage,
              bookingDate: new Date().toISOString(),
              eventDate: "30 Novembre 2025",
              eventLocation: "Pool Paradise, Douala",
              eventTime: "20h00 - 04h00"
            })
          }
        } else if (singleBookingId && singleName) {
          // Single Booking
          const qrDataString = `GENESIS-${singleBookingId}`
          const qrImage = await QRCode.toDataURL(qrDataString, {
            width: 600,
            margin: 2,
            color: { dark: "#000000", light: "#FFFFFF" }
          })

          newBookings.push({
            id: singleBookingId,
            fullName: singleName,
            phone,
            passType,
            price,
            qrCode: qrImage,
            bookingDate: new Date().toISOString(),
            eventDate: "30 Novembre 2025",
            eventLocation: "Pool Paradise, Douala",
            eventTime: "20h00 - 04h00"
          })
        } else {
          // Fallback or error
          router.push("/passes")
          return
        }

        setBookings(newBookings)
        setLoading(false)

      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadBookingData()
  }, [searchParams, router])


  const generatePDF = async () => {
    if (!ticketsContainerRef.current || bookings.length === 0) return

    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [800, 350]
      })

      // Iterate through all ticket elements in the hidden container
      const ticketElements = ticketsContainerRef.current.children

      for (let i = 0; i < ticketElements.length; i++) {
        const ticketEl = ticketElements[i] as HTMLElement

        const canvas = await html2canvas(ticketEl, {
          scale: 2, // Good balance for performance/quality
          useCORS: true,
          backgroundColor: null,
          logging: false
        })

        const imgData = canvas.toDataURL('image/png', 1.0)

        if (i > 0) {
          pdf.addPage([800, 350], 'landscape')
        }

        pdf.addImage(imgData, 'PNG', 0, 0, 800, 350)
      }

      pdf.save(`Genesis-Tickets-${bookings[0].id}.pdf`)

    } catch (err) {
      console.error("PDF Generation failed", err)
      alert("Erreur lors de la génération du PDF")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050010] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (bookings.length === 0) return null

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
          {bookings.length > 1 ? "Réservations Confirmées" : "Réservation Confirmée"}
        </h1>
        <p className="text-platinum/70 text-lg">
          {bookings.length > 1
            ? "Vos accès exclusifs sont prêts. Veuillez télécharger vos billets."
            : "Votre accès exclusif est prêt. Veuillez télécharger votre billet."
          }
        </p>
      </div>

      {/* TICKETS DISPLAY LIST */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col gap-8 items-center mb-12 px-4">
        {bookings.map((booking, index) => (
          <div key={booking.id} className="w-full max-w-md md:max-w-4xl bg-[#0a0a0a] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-purple-500/30">
            {/* Image Section */}
            <div className="w-full md:w-[300px] h-48 md:h-auto relative shrink-0">
              <Image
                src={PASS_IMAGES[booking.passType]}
                alt="Pass"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-purple-900/30 mix-blend-overlay" />
              <div className="md:hidden absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                <span className="text-white font-mono font-bold text-sm">{booking.id}</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 md:p-8 flex flex-col relative bg-gradient-to-b md:bg-gradient-to-r from-[#0a0a0a] to-[#1a1a2e]">
              <div className="hidden md:flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-neon-purple text-xs font-bold tracking-[0.3em] mb-2 uppercase">Boarding Pass</h2>
                  <h1 className="text-white text-3xl font-bold tracking-wider" style={{ fontFamily: "var(--font-playfair), serif" }}>GENESIS VOL.I</h1>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded border border-white/20 h-fit">
                  <span className="text-white font-mono font-bold">{booking.id}</span>
                </div>
              </div>

              <div className="md:hidden mb-6 text-center">
                <h1 className="text-white text-2xl font-bold tracking-wider mb-1" style={{ fontFamily: "var(--font-playfair), serif" }}>GENESIS VOL.I</h1>
                <p className="text-neon-purple text-xs font-bold tracking-[0.3em] uppercase">Boarding Pass</p>
              </div>

              <div className="grid grid-cols-2 md:flex md:gap-8 gap-y-6 mb-8">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider mb-1">Invité</p>
                  <p className="text-white font-semibold text-lg">{booking.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider mb-1">Pass</p>
                  <p className="text-fuchsia-400 font-bold text-lg">{booking.passType}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider mb-1">Prix</p>
                  <p className="text-white font-semibold text-lg">{booking.price}</p>
                </div>
              </div>

              <div className="mt-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                <div className="space-y-3 w-full md:w-auto">
                  <div className="flex items-center gap-3 text-gray-300 text-sm bg-white/5 p-2 rounded-lg md:bg-transparent md:p-0">
                    <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{booking.eventDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 text-sm bg-white/5 p-2 rounded-lg md:bg-transparent md:p-0">
                    <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Pool Paradise, Douala</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-lg shrink-0 w-full md:w-auto flex justify-center">
                  <img src={booking.qrCode} alt="QR" className="w-48 h-48 object-contain" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HIDDEN PDF SOURCE (Renders ALL tickets for PDF generation) */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={ticketsContainerRef}>
          {bookings.map((booking) => (
            <div
              key={`pdf-${booking.id}`}
              className="w-[800px] h-[350px] bg-[#0a0a0a] flex relative border border-[#a855f7] overflow-hidden mb-10"
            >
              <div className="w-[30%] h-full relative">
                <img
                  src={PASS_IMAGES[booking.passType]}
                  alt="Pass"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#581c874d]" />
              </div>
              <div className="flex-1 px-10 py-6 flex flex-col justify-between bg-gradient-to-r from-[#0a0a0a] to-[#1a1a2e]">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-[#a855f7] text-sm font-bold tracking-[0.3em] mb-1 uppercase">Boarding Pass</h2>
                    <h1 className="text-[#ffffff] text-4xl font-bold tracking-wider" style={{ fontFamily: "var(--font-playfair), serif" }}>GENESIS VOL.I</h1>
                  </div>
                  <div className="bg-[#ffffff1a] px-4 py-2 rounded border border-[#ffffff33] mt-2">
                    <span className="text-[#ffffff] font-mono font-bold text-lg">{booking.id}</span>
                  </div>
                </div>
                <div className="flex gap-12 my-auto items-center">
                  <div>
                    <p className="text-[#9ca3af] text-xs uppercase tracking-wider mb-2">Invité</p>
                    <p className="text-[#ffffff] text-xl font-bold">{booking.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[#9ca3af] text-xs uppercase tracking-wider mb-2">Pass</p>
                    <p className="text-[#e879f9] text-xl font-bold">{booking.passType}</p>
                  </div>
                  <div>
                    <p className="text-[#9ca3af] text-xs uppercase tracking-wider mb-2">Prix</p>
                    <p className="text-[#ffffff] text-xl font-bold">{booking.price}</p>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-3 pb-2">
                    <p className="text-[#d1d5db] text-base flex items-center font-medium">
                      <span className="text-[#a855f7] mr-3">📅</span> {booking.eventDate}
                    </p>
                    <p className="text-[#d1d5db] text-base flex items-center font-medium">
                      <span className="text-[#a855f7] mr-3">📍</span> {booking.eventLocation}
                    </p>
                    <p className="text-[#d1d5db] text-base flex items-center font-medium">
                      <span className="text-[#a855f7] mr-3">⏰</span> {booking.eventTime}
                    </p>
                  </div>
                  <div className="bg-[#ffffff] p-2 rounded-xl shadow-lg">
                    <img src={booking.qrCode} className="w-32 h-32 object-contain" />
                  </div>
                </div>
              </div>
            </div>
          ))}
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
          disabled={loading}
          className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white px-8 py-6 rounded-full shadow-[0_0_20px_rgba(192,132,252,0.4)] font-bold tracking-wide w-full md:w-auto"
        >
          <Download className="mr-2 h-5 w-5" />
          Télécharger les Billets (PDF)
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

