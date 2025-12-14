"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CreditCard } from "lucide-react"
import crypto from "crypto"

interface PaymentFormProps {
  passName: string
  passPrice: string
  passImage: string
}

export default function PaymentForm({ passName, passPrice, passImage }: PaymentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  })
  const [selectedOperator, setSelectedOperator] = useState<"orange" | "mtn" | null>(null)
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    operator: "",
  })

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/[\r\n]/g, '') // Remove line breaks
      .replace(/[\"']/g, '') // Remove quotes
      .substring(0, 100) // Limit length
  }

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors = {
      fullName: "",
      phone: "",
      operator: "",
    }

    // Validate full name
    const sanitizedName = sanitizeInput(formData.fullName)
    if (!sanitizedName) {
      newErrors.fullName = "Le nom complet est requis"
    } else if (sanitizedName.length < 3) {
      newErrors.fullName = "Le nom doit contenir au moins 3 caractères"
    } else if (!/^[a-zA-Z\s\-']+$/.test(sanitizedName)) {
      newErrors.fullName = "Le nom ne doit contenir que des lettres, espaces, tirets et apostrophes"
    }

    // Validate phone number (Cameroon format)
    const phoneRegex = /^(\+237|237)?[26]\d{8}$/
    const cleanedPhone = formData.phone.replace(/\s/g, "")
    if (!cleanedPhone) {
      newErrors.phone = "Le numéro de téléphone est requis"
    } else if (!phoneRegex.test(cleanedPhone)) {
      newErrors.phone = "Numéro invalide (ex: 6XXXXXXXX ou 237XXXXXXXXX)"
    }

    // Validate operator selection
    if (!selectedOperator) {
      newErrors.operator = "Veuillez sélectionner un opérateur"
    }

    setErrors(newErrors)
    return !newErrors.fullName && !newErrors.phone && !newErrors.operator
  }

  // Format phone number for storage
  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\s/g, "")
    if (cleaned.startsWith("+237")) {
      return cleaned
    } else if (cleaned.startsWith("237")) {
      return "+" + cleaned
    } else {
      return "+237" + cleaned
    }
  }

  // Generate secure booking ID
  const generateBookingId = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = crypto.randomBytes(4).toString('hex').toUpperCase()
    return `2025-${timestamp}-${random}`
  }

  // Generate CSRF token
  const [csrfToken, setCsrfToken] = useState<string>("")

  useEffect(() => {
    const token = crypto.randomBytes(32).toString('hex')
    setCsrfToken(token)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const formattedPhone = formatPhoneNumber(formData.phone)

      // 🔴 REAL BACKEND CALL
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formattedPhone,
          passType: passName === "ONE MAN" ? "ONE_MAN" : passName === "ONE LADY" ? "ONE_LADY" : "FIVE_QUEENS",
          operator: selectedOperator,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Payment failed")
      }

      const booking = result.booking
      const bookingId = booking.id

      // Store booking data in sessionStorage for confirmation page (Frontend display)
      sessionStorage.setItem(`booking_${bookingId}`, JSON.stringify({
        ...booking,
        eventDate: "30 Novembre 2025",
        eventLocation: "Pool Paradise, Douala",
        eventTime: "20h00 - 04h00",
      }))

      // Redirect to confirmation page with booking ID
      router.push(`/confirmation?bookingId=${bookingId}&name=${encodeURIComponent(booking.fullName)}&phone=${encodeURIComponent(booking.phone)}&passType=${encodeURIComponent(passName)}&price=${encodeURIComponent(booking.price)}`)

    } catch (error: any) {
      console.error("Payment error:", error)
      alert(error.message || "Une erreur est survenue lors de la réservation.")
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleOperatorSelect = (operator: "orange" | "mtn") => {
    setSelectedOperator(operator)
    if (errors.operator) {
      setErrors((prev) => ({ ...prev, operator: "" }))
    }
  }

  // Descriptions mapping
  const descriptions: Record<string, string> = {
    "ONE MAN": "Accès exclusif pour un homme. Profitez de l'ambiance piscine, des cocktails et de la musique live.",
    "ONE LADY": "Accès élégant pour une femme. Une soirée inoubliable avec welcome drink offert.",
    "FIVE QUEENS": "Pack spécial pour 5 amis. Célébrez ensemble avec une table réservée et bouteille offerte."
  }

  const description = descriptions[passName] || "Accès à l'événement Genesis Pool Party."

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background - Deep Purple Geometric */}
      <div className="fixed inset-0 z-0 bg-[#050010]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20" />
        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* LEFT COLUMN: Pass Image & Description Card */}
        <div className="glass-card rounded-[2rem] overflow-hidden p-6 border border-white/10 bg-white/5 backdrop-blur-xl animate-slide-right">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 shadow-2xl">
            <Image
              src={passImage}
              alt={passName}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair), serif" }}>{passName}</h2>
              <p className="text-fuchsia-400 font-bold text-xl">{passPrice}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold uppercase tracking-wider border-b border-white/10 pb-2">Détails du Pass</h3>
            <p className="text-platinum/80 leading-relaxed font-light">
              {description}
            </p>
            <div className="flex items-center gap-2 text-sm text-stardust/70 pt-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Places limitées disponibles</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Form (Exact Match) */}
        <div className="glass-card rounded-[2rem] p-8 border border-white/10 bg-white/5 backdrop-blur-xl md:sticky md:top-8 animate-slide-left">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-platinum/80 text-sm tracking-wide">Name</Label>
              <div className="relative group">
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Entrez votre nom"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`bg-black/20 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:border-neon-purple/50 focus:ring-neon-purple/20 transition-all ${errors.fullName ? "border-red-500/50" : ""}`}
                  disabled={isLoading}
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
              </div>
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-platinum/80 text-sm tracking-wide">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+237 ..."
                value={formData.phone}
                onChange={handleInputChange}
                className={`bg-black/20 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:border-neon-purple/50 focus:ring-neon-purple/20 transition-all ${errors.phone ? "border-red-500/50" : ""}`}
                disabled={isLoading}
                required
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Selected Pass Display (Exact Match) */}
            <div className="space-y-2 pt-2">
              <Label className="text-platinum/80 text-sm tracking-wide">Selected Pass</Label>
              <div className="bg-white/10 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 bg-white/10 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white/70" />
                  </div>
                  <span className="text-white font-medium">{passName}</span>
                </div>
                <span className="text-white font-bold">{passPrice}</span>
              </div>
            </div>

            {/* Operator Selection */}
            <div className="space-y-3 pt-2">
              <Label className="text-platinum/80 text-sm tracking-wide">Select Payment Operator</Label>
              <div className="grid grid-cols-3 gap-3">
                {/* MTN */}
                <button
                  type="button"
                  onClick={() => !isLoading && handleOperatorSelect("mtn")}
                  className={`relative p-3 rounded-xl border transition-all duration-300 flex items-center justify-center group overflow-hidden ${selectedOperator === "mtn"
                    ? "bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    : "bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/30"
                    }`}
                >
                  <span className={`text-sm font-bold ${selectedOperator === "mtn" ? "text-yellow-400" : "text-white/70"}`}>MTN</span>
                </button>

                {/* Orange */}
                <button
                  type="button"
                  onClick={() => !isLoading && handleOperatorSelect("orange")}
                  className={`relative p-3 rounded-xl border transition-all duration-300 flex items-center justify-center group overflow-hidden ${selectedOperator === "orange"
                    ? "bg-orange-500/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                    : "bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/30"
                    }`}
                >
                  <span className={`text-sm font-bold ${selectedOperator === "orange" ? "text-orange-400" : "text-white/70"}`}>Orange</span>
                </button>

                {/* Cash */}
                <button
                  type="button"
                  disabled
                  className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center opacity-50 cursor-not-allowed"
                >
                  <span className="text-sm font-bold text-white/40">Cash</span>
                </button>
              </div>
              {errors.operator && <p className="text-red-400 text-xs text-center">{errors.operator}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold tracking-wider py-6 rounded-xl shadow-lg shadow-purple-900/40 transition-all hover:scale-[1.02] mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  PROCESSING...
                </>
              ) : (
                "CONFIRM BOOKING"
              )}
            </Button>

          </form>
        </div>
      </div>

      <div className="absolute bottom-4 text-white/20 text-xs">
        SECURE CHECKOUT
      </div>
    </div>
  )
}
