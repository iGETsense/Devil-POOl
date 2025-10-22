"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Download, Share2, CheckCircle, Calendar, MapPin, Clock } from "lucide-react"

export default function ConfirmationPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Données de démonstration (seront remplacées par les vraies données du backend)
  const bookingData = {
    name: "John Doe",
    phone: "+237 6XX XXX XXX",
    passType: "ONE MAN",
    price: "15 000 FCFA",
    bookingId: "DT-2025-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DT-PASS-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    eventDate: "Novembre 2025",
    eventLocation: "Pool Paradise, Douala",
    eventTime: "20h00 - 04h00"
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-500 mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4 gold-text"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            Réservation Confirmée !
          </h1>
          <p className="text-white/80 text-lg">
            Ton pass Demon Time est prêt. Prépare-toi pour la soirée la plus chaude ! 🔥
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl overflow-hidden border-4 border-[#ff3366] bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm p-8 md:p-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side - QR Code */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-6 rounded-2xl mb-6 shadow-2xl shadow-[#ff3366]/30">
                <Image
                  src={bookingData.qrCode}
                  alt="QR Code"
                  width={300}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-white/60 text-sm text-center mb-4">
                Scanne ce QR code à l&apos;entrée
              </p>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-900 to-red-700 text-white rounded-full hover:from-red-800 hover:to-red-600 transition-all">
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all">
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              </div>
            </div>

            {/* Right Side - Booking Details */}
            <div className="space-y-6">
              <div>
                <h2 
                  className="text-3xl font-bold mb-6 gold-text"
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                  Détails de la réservation
                </h2>
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b border-white/20">
                  <p className="text-white/60 text-sm mb-1">Numéro de réservation</p>
                  <p className="text-white text-lg font-mono font-bold">{bookingData.bookingId}</p>
                </div>

                <div className="pb-4 border-b border-white/20">
                  <p className="text-white/60 text-sm mb-1">Nom</p>
                  <p className="text-white text-lg font-semibold">{bookingData.name}</p>
                </div>

                <div className="pb-4 border-b border-white/20">
                  <p className="text-white/60 text-sm mb-1">Téléphone</p>
                  <p className="text-white text-lg">{bookingData.phone}</p>
                </div>

                <div className="pb-4 border-b border-white/20">
                  <p className="text-white/60 text-sm mb-1">Type de pass</p>
                  <p className="text-2xl font-bold gold-text">{bookingData.passType}</p>
                </div>

                <div className="pb-4 border-b border-white/20">
                  <p className="text-white/60 text-sm mb-1">Montant payé</p>
                  <p className="text-2xl font-bold" style={{ color: "#ff3366" }}>{bookingData.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Information */}
        <div className="rounded-3xl overflow-hidden border-4 border-[#ff3366] bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm p-8 mb-8">
          <h3 
            className="text-2xl font-bold mb-6 gold-text text-center"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            Informations de l&apos;événement
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#ff3366]/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-[#ff3366]" />
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Date</p>
                <p className="text-white font-semibold">{bookingData.eventDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#ff3366]/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[#ff3366]" />
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Horaire</p>
                <p className="text-white font-semibold">{bookingData.eventTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#ff3366]/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#ff3366]" />
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Lieu</p>
                <p className="text-white font-semibold">{bookingData.eventLocation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="rounded-3xl overflow-hidden border-4 border-[#ffcc00] bg-gradient-to-b from-[#ffcc00]/10 to-black/70 backdrop-blur-sm p-8">
          <h3 className="text-xl font-bold mb-4 text-[#ffcc00] flex items-center gap-2">
            ⚠️ Important
          </h3>
          <ul className="space-y-3 text-white/80">
            <li className="flex items-start gap-2">
              <span className="text-[#ffcc00] mt-1">•</span>
              <span>Présente ton QR code à l&apos;entrée. Pas de QR, pas d&apos;entrée.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ffcc00] mt-1">•</span>
              <span>Ton QR code est unique et personnel. Ne le partage pas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ffcc00] mt-1">•</span>
              <span>Télécharge ou prends une capture d&apos;écran de ton QR code.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ffcc00] mt-1">•</span>
              <span>Arrive à l&apos;heure pour profiter pleinement de la soirée !</span>
            </li>
          </ul>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-block px-10 py-4 bg-gradient-to-r from-red-900 to-red-700 text-white text-lg font-semibold rounded-full hover:from-red-800 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-red-500/50"
          >
            Retour à l&apos;accueil
          </a>
        </div>
      </div>
    </main>
  )
}
