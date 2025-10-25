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
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: "var(--navy)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Pass Summary */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="rounded-3xl overflow-hidden elegant-border bg-gradient-to-b from-[var(--deep-blue)]/90 to-[var(--navy)]/70 backdrop-blur-sm p-8">
                <h2 
                  className="text-3xl font-bold mb-4 gold-text text-center"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
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

                <div className="space-y-4" style={{ color: "var(--platinum)" }}>
                  <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: "rgba(229, 228, 226, 0.2)" }}>
                    <span className="text-lg">Pass sélectionné</span>
                    <span className="text-xl font-bold gold-text">{passName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: "rgba(229, 228, 226, 0.2)" }}>
                    <span className="text-lg">Prix</span>
                    <span className="text-2xl font-bold gold-text">{passPrice}</span>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-center" style={{ color: "var(--platinum)", opacity: 0.7 }}>
                      ✓ Accès garanti à l'événement<br/>
                      ✓ Badge exclusif Genesis<br/>
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
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Finaliser la réservation
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--platinum)", opacity: 0.9 }}>Informations personnelles</h3>
                  
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--platinum)", opacity: 0.5 }} />
                    <input
                      type="text"
                      placeholder="Nom complet"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none transition-all"
                      style={{ backgroundColor: "rgba(15, 20, 25, 0.5)", border: "2px solid rgba(229, 228, 226, 0.2)", color: "var(--platinum)" }}
                      required
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--platinum)", opacity: 0.5 }} />
                    <input
                      type="tel"
                      placeholder="Numéro de téléphone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none transition-all"
                      style={{ backgroundColor: "rgba(15, 20, 25, 0.5)", border: "2px solid rgba(229, 228, 226, 0.2)", color: "var(--platinum)" }}
                      required
                    />
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--platinum)", opacity: 0.9 }}>
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
                          : "bg-black/30 hover:border-[#ff6600]/50"
                      }`}
                      style={{ borderColor: selectedOperator === "orange" ? "#ff6600" : "rgba(229, 228, 226, 0.2)" }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                          <span className="text-3xl font-bold" style={{ color: "#ff6600" }}>OM</span>
                        </div>
                        <span className="font-semibold" style={{ color: "var(--platinum)" }}>Orange Money</span>
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
                          : "bg-black/30 hover:border-[#ffcc00]/50"
                      }`}
                      style={{ borderColor: selectedOperator === "mtn" ? "#ffcc00" : "rgba(229, 228, 226, 0.2)" }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-[#ffcc00] rounded-xl flex items-center justify-center">
                          <span className="text-2xl font-bold text-black">MTN</span>
                        </div>
                        <span className="font-semibold" style={{ color: "var(--platinum)" }}>MTN MoMo</span>
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
                      ? "bg-gradient-to-r from-[var(--deep-blue)] to-[var(--accent-blue)] hover:shadow-2xl hover:shadow-[var(--champagne-gold)]/50 transform hover:scale-105"
                      : "bg-gray-700 cursor-not-allowed"
                  }`}
                  style={selectedOperator ? { color: "var(--platinum)" } : { color: "#9ca3af" }}
                >
                  {selectedOperator ? "Procéder au paiement" : "Sélectionnez un opérateur"}
                </button>

                <p className="text-center text-sm" style={{ color: "var(--platinum)", opacity: 0.6 }}>
                  En continuant, vous acceptez nos conditions d&apos;utilisation
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Animation Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: "rgba(15, 20, 25, 0.95)" }}>
          <div className="text-center">
            {/* Animated Logo */}
            <div className="relative mb-8">
              <div className="relative w-48 h-48 mx-auto">
                {/* Pulsing outer ring */}
                <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ border: "4px solid var(--champagne-gold)" }}></div>
                
                {/* Rotating ring */}
                <div className="absolute inset-4 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: "var(--champagne-gold)", borderBottomColor: "var(--accent-blue)" }}></div>
                
                {/* Inner glow circle */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br animate-pulse" style={{ backgroundImage: "linear-gradient(to bottom right, rgba(212, 175, 55, 0.3), rgba(74, 144, 226, 0.3))" }}></div>
                
                {/* Center logo text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold gold-text mb-2" style={{ fontFamily: "var(--font-playfair), serif" }}>
                      Genesis
                    </div>
                    <div className="flex gap-1 justify-center">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "var(--champagne-gold)", animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "var(--champagne-gold)", animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "var(--champagne-gold)", animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading text */}
            <h2 
              className="text-3xl font-bold gold-text mb-4 animate-pulse"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Traitement en cours...
            </h2>
            <p className="text-lg" style={{ color: "var(--platinum)", opacity: 0.7 }}>
              Connexion avec {selectedOperator === "orange" ? "Orange Money" : "MTN MoMo"}
            </p>
            
            {/* Animated sparkles */}
            <div className="flex justify-center gap-4 mt-8">
              <div className="animate-pulse" style={{ color: "var(--champagne-gold)", animationDelay: "0ms" }}>✨</div>
              <div className="animate-pulse" style={{ color: "var(--champagne-gold)", animationDelay: "200ms" }}>✨</div>
              <div className="animate-pulse" style={{ color: "var(--champagne-gold)", animationDelay: "400ms" }}>✨</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
