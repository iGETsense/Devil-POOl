"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Phone, User, Mail, CreditCard } from "lucide-react"

interface PaymentFormProps {
  passName: string
  passPrice: string
  passImage: string
}

export default function PaymentForm({ passName, passPrice, passImage }: PaymentFormProps) {
  const router = useRouter()
  const [selectedOperator, setSelectedOperator] = useState<"orange" | "mtn" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      console.log("Payment data:", { ...formData, operator: selectedOperator, pass: passName })
      // Here you would handle the actual payment and backend interaction
      // Redirect to confirmation page
      router.push("/confirmation")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Pass Summary */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="rounded-3xl overflow-hidden border-4 border-[#ff3366] bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm p-8">
                <h2 
                  className="text-3xl font-bold mb-4 gold-text text-center"
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                  Récapitulatif
                </h2>
                
                <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={passImage}
                    alt={passName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4 text-white/90">
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span className="text-lg">Pass sélectionné</span>
                    <span className="text-xl font-bold gold-text">{passName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span className="text-lg">Prix</span>
                    <span className="text-2xl font-bold" style={{ color: "#ff3366" }}>{passPrice}</span>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-white/70 text-center">
                      ✓ Accès garanti à la soirée<br/>
                      ✓ Estampille officielle DT<br/>
                      ✓ QR Code unique
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Form */}
          <div className="order-1 lg:order-2">
            <div className="rounded-3xl overflow-hidden border-4 border-[#ff3366] bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm p-8">
              <h2 
                className="text-4xl font-bold mb-8 gold-text text-center"
                style={{ fontFamily: "var(--font-cinzel), serif" }}
              >
                Finaliser la réservation
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white/90 mb-4">Informations personnelles</h3>
                  
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      placeholder="Nom complet"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-black/50 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-[#ff3366] focus:outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="tel"
                      placeholder="Numéro de téléphone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-black/50 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-[#ff3366] focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white/90 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Méthode de paiement
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Orange Money */}
                    <button
                      type="button"
                      onClick={() => setSelectedOperator("orange")}
                      className={`relative p-6 rounded-2xl border-3 transition-all duration-300 ${
                        selectedOperator === "orange"
                          ? "border-[#ff6600] bg-[#ff6600]/20 shadow-lg shadow-[#ff6600]/50 scale-105"
                          : "border-white/20 bg-black/30 hover:border-[#ff6600]/50"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                          <span className="text-3xl font-bold" style={{ color: "#ff6600" }}>OM</span>
                        </div>
                        <span className="text-white font-semibold">Orange Money</span>
                      </div>
                      {selectedOperator === "orange" && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#ff6600] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>

                    {/* MTN Mobile Money */}
                    <button
                      type="button"
                      onClick={() => setSelectedOperator("mtn")}
                      className={`relative p-6 rounded-2xl border-3 transition-all duration-300 ${
                        selectedOperator === "mtn"
                          ? "border-[#ffcc00] bg-[#ffcc00]/20 shadow-lg shadow-[#ffcc00]/50 scale-105"
                          : "border-white/20 bg-black/30 hover:border-[#ffcc00]/50"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-[#ffcc00] rounded-xl flex items-center justify-center">
                          <span className="text-2xl font-bold text-black">MTN</span>
                        </div>
                        <span className="text-white font-semibold">MTN MoMo</span>
                      </div>
                      {selectedOperator === "mtn" && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#ffcc00] rounded-full flex items-center justify-center">
                          <span className="text-black text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedOperator}
                  className={`w-full py-5 rounded-full font-bold text-lg transition-all duration-300 ${
                    selectedOperator
                      ? "bg-gradient-to-r from-red-900 to-red-700 text-white hover:from-red-800 hover:to-red-600 hover:shadow-2xl hover:shadow-red-500/50 transform hover:scale-105"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {selectedOperator ? "Procéder au paiement" : "Sélectionnez un opérateur"}
                </button>

                <p className="text-center text-white/60 text-sm">
                  En continuant, vous acceptez nos conditions d&apos;utilisation
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Animation Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <div className="text-center">
            {/* Animated Logo */}
            <div className="relative mb-8">
              <div className="relative w-48 h-48 mx-auto">
                {/* Pulsing outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-[#ff3366] animate-ping opacity-75"></div>
                
                {/* Rotating ring */}
                <div className="absolute inset-4 rounded-full border-4 border-t-[#ff3366] border-r-transparent border-b-[#ffcc00] border-l-transparent animate-spin"></div>
                
                {/* Inner glow circle */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#ff3366]/30 to-[#ffcc00]/30 animate-pulse"></div>
                
                {/* Center logo text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold gold-text mb-2" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                      DT
                    </div>
                    <div className="flex gap-1 justify-center">
                      <div className="w-2 h-2 bg-[#ff3366] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-[#ff3366] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-[#ff3366] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading text */}
            <h2 
              className="text-3xl font-bold gold-text mb-4 animate-pulse"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Traitement en cours...
            </h2>
            <p className="text-white/70 text-lg">
              Connexion avec {selectedOperator === "orange" ? "Orange Money" : "MTN MoMo"}
            </p>
            
            {/* Animated flames */}
            <div className="flex justify-center gap-4 mt-8">
              <div className="text-[#ff3366] animate-pulse" style={{ animationDelay: "0ms" }}>🔥</div>
              <div className="text-[#ff3366] animate-pulse" style={{ animationDelay: "200ms" }}>🔥</div>
              <div className="text-[#ff3366] animate-pulse" style={{ animationDelay: "400ms" }}>🔥</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
