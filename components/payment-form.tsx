"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CreditCard, Users, Smartphone, CheckCircle } from "lucide-react"
import crypto from "crypto"

interface PaymentFormProps {
  passName: string
  passPrice: string
  passImage: string
}

const STEPS = [
  { id: "init", label: "Initialisation sécurisée", icon: Loader2 },
  { id: "sending", label: "Contact de l'opérateur", icon: Users },
  { id: "waiting", label: "Validation sur votre téléphone", icon: Smartphone },
  { id: "confirming", label: "Confirmation du paiement", icon: CheckCircle },
]

export default function PaymentForm({ passName, passPrice, passImage }: PaymentFormProps) {
  const router = useRouter()
  // State for interactive modal
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "init" | "sending" | "waiting" | "confirming" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isFiveQueens = passName === "FIVE QUEENS"

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    fullNames: ["", "", "", "", ""], // For Five Queens
  })

  const [selectedOperator, setSelectedOperator] = useState<"orange" | "mtn" | null>(null)
  const [errors, setErrors] = useState({
    fullName: "",
    fullNames: ["", "", "", "", ""],
    phone: "",
    operator: "",
    form: "",
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
      fullNames: ["", "", "", "", ""],
      phone: "",
      operator: "",
      form: "",
    }
    let isValid = true

    // Validate names
    if (isFiveQueens) {
      formData.fullNames.forEach((name, index) => {
        const sanitizedName = sanitizeInput(name)
        if (!sanitizedName) {
          newErrors.fullNames[index] = `Nom de la Queen ${index + 1} requis`
          isValid = false
        } else if (sanitizedName.length < 3) {
          newErrors.fullNames[index] = "3 caractères minimum"
          isValid = false
        }
      })
    } else {
      const sanitizedName = sanitizeInput(formData.fullName)
      if (!sanitizedName) {
        newErrors.fullName = "Le nom complet est requis"
        isValid = false
      } else if (sanitizedName.length < 3) {
        newErrors.fullName = "Le nom doit contenir au moins 3 caractères"
        isValid = false
      }
    }

    // Validate phone number (Cameroon format)
    const phoneRegex = /^(\+237|237)?[26]\d{8}$/
    const cleanedPhone = formData.phone.replace(/\s/g, "")
    if (!cleanedPhone) {
      newErrors.phone = "Le numéro de téléphone est requis"
      isValid = false
    } else if (!phoneRegex.test(cleanedPhone)) {
      newErrors.phone = "Numéro invalide (ex: 6XXXXXXXX ou 237XXXXXXXXX)"
      isValid = false
    }

    // Validate operator selection
    if (!selectedOperator) {
      newErrors.operator = "Veuillez sélectionner un opérateur"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // RESET STATE
    setPaymentStatus("init")
    setErrorMessage("")

    try {
      const formattedPhone = formatPhoneNumber(formData.phone)
      const passTypeCode = passName === "ONE MAN" ? "ONE_MAN" : passName === "ONE LADY" ? "ONE_LADY" : "FIVE_QUEENS"

      // STEP 1: INITIALIZATION
      // Artificial delay for UX (so user sees the step)
      await new Promise(r => setTimeout(r, 800))

      setPaymentStatus("sending")

      // STEP 2: SEND REQUEST TO BACKEND
      const collectResponse = await fetch("/api/payment/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: isFiveQueens ? undefined : formData.fullName.trim(),
          fullNames: isFiveQueens ? formData.fullNames.map(n => n.trim()) : undefined,
          phone: formattedPhone,
          passType: passTypeCode,
          operator: selectedOperator,
        }),
      })

      const collectResult = await collectResponse.json()

      if (!collectResponse.ok || !collectResult.success) {
        throw new Error(collectResult.message || "Échec de l'initialisation")
      }

      const bookingId = collectResult.bookingId
      const bookings = collectResult.bookings

      // CHECK FOR IMMEDIATE SUCCESS
      // If the backend already confirmed the payment (synchronous capture), 
      // the booking status might be "paid" or the transaction status "SUCCESS".
      const isImmediatelyPaid =
        (collectResult.transaction && collectResult.transaction.status === "SUCCESS") ||
        (bookings && bookings.length > 0 && bookings[0].status === "paid");

      if (isImmediatelyPaid) {
        setPaymentStatus("success")
        await new Promise(r => setTimeout(r, 1000))

        if (isFiveQueens && bookings) {
          const bookingIds = bookings.map((b: any) => b.id).join(",")
          const names = formData.fullNames.map(n => n.trim()).join(",")
          router.push(`/confirmation?bookingIds=${bookingIds}&names=${encodeURIComponent(names)}&phone=${encodeURIComponent(formattedPhone)}&passType=${encodeURIComponent(passName)}&price=${encodeURIComponent(collectResult.amount)}`)
        } else {
          router.push(`/confirmation?bookingId=${bookingId}&name=${encodeURIComponent(formData.fullName.trim())}&phone=${encodeURIComponent(formattedPhone)}&passType=${encodeURIComponent(passName)}&price=${encodeURIComponent(collectResult.amount)}`)
        }
        return
      }

      // STEP 3: WAITING FOR USER ACTION
      setPaymentStatus("waiting")

      // Poll for Payment Status
      let attempts = 0
      const maxAttempts = 120 // 2 minutes (1s interval)

      const pollStatus = async (): Promise<boolean> => {
        while (attempts < maxAttempts) {
          attempts++
          // Fast polling: 1 second
          await new Promise(resolve => setTimeout(resolve, 1000))

          const statusResponse = await fetch(`/api/payment/status?bookingId=${bookingId}`)
          const statusResult = await statusResponse.json()

          if (statusResult.status === "SUCCESS") {
            return true
          } else if (statusResult.status === "FAILED") {
            throw new Error("Paiement refusé ou échoué")
          }
          // If still pending, loop continues
        }
        throw new Error("Délai d'attente dépassé. Vérifiez votre téléphone.")
      }

      const paymentSuccess = await pollStatus()

      setPaymentStatus("confirming")
      await new Promise(r => setTimeout(r, 1000))

      if (paymentSuccess) {
        setPaymentStatus("success")
        // Delay redirect slightly to show success state
        await new Promise(r => setTimeout(r, 1500))

        if (isFiveQueens && collectResult.bookings) {
          const bookingIds = collectResult.bookings.map((b: any) => b.id).join(",")
          const names = formData.fullNames.map(n => n.trim()).join(",")
          router.push(`/confirmation?bookingIds=${bookingIds}&names=${encodeURIComponent(names)}&phone=${encodeURIComponent(formattedPhone)}&passType=${encodeURIComponent(passName)}&price=${encodeURIComponent(collectResult.amount)}`)
        } else {
          router.push(`/confirmation?bookingId=${bookingId}&name=${encodeURIComponent(formData.fullName.trim())}&phone=${encodeURIComponent(formattedPhone)}&passType=${encodeURIComponent(passName)}&price=${encodeURIComponent(collectResult.amount)}`)
        }
      }

    } catch (error: any) {
      console.error("Payment error:", error)
      setPaymentStatus("error")
      setErrorMessage(error.message || "Une erreur est survenue")
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

  const handleArrayNameChange = (index: number, value: string) => {
    const newNames = [...formData.fullNames]
    newNames[index] = value
    setFormData(prev => ({ ...prev, fullNames: newNames }))

    // Clear error
    if (errors.fullNames[index]) {
      const newErrors = { ...errors }
      newErrors.fullNames[index] = ""
      setErrors(newErrors)
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

      {/* OVERLAY MODAL FOR PAYMENT STATUS */}
      {paymentStatus !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#1a1a2e] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Decorative glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {paymentStatus === "error" ? "Oups ! Erreur" :
                  paymentStatus === "success" ? "Paiement Réussi !" :
                    "Traitement en cours..."}
              </h3>
              <p className="text-gray-400 text-sm">
                {paymentStatus === "waiting" ? "Veuillez valider la transaction sur votre téléphone." :
                  paymentStatus === "error" ? "La transaction a échoué." :
                    "Ne fermez pas cette page."}
              </p>
            </div>

            {/* Steps Visualization */}
            <div className="space-y-4 relative">
              {/* Connecting Line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/10" />

              {STEPS.map((step, idx) => {
                const isActive = paymentStatus === step.id
                const isCompleted = ["sending", "waiting", "confirming", "success"].includes(paymentStatus) && idx < STEPS.findIndex(s => s.id === paymentStatus)
                const isError = paymentStatus === "error" && isActive

                let iconColor = "text-gray-600"
                let glow = ""
                if (paymentStatus === "success") { iconColor = "text-green-400"; glow = "shadow-[0_0_15px_rgba(74,222,128,0.2)]" }
                else if (isCompleted) { iconColor = "text-green-400" }
                else if (isActive) { iconColor = "text-blue-400 animate-spin-slow"; glow = "shadow-[0_0_15px_rgba(96,165,250,0.3)]" }

                if (paymentStatus === "error" && step.id === "init") iconColor = "text-red-400"

                return (
                  <div key={step.id} className="relative flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center bg-[#0a0a12] border border-white/10 ${glow}`}>
                      <step.icon className={`w-4 h-4 ${iconColor}`} />
                    </div>
                    <span className={`${isActive || isCompleted ? "text-white" : "text-gray-500"} font-medium transition-colors`}>
                      {step.label}
                    </span>
                    {isActive && paymentStatus === "waiting" && (
                      <div className="absolute right-4 w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Error Message & Close Action */}
            {paymentStatus === "error" && (
              <div className="mt-6 animate-in slide-in-from-bottom-2">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-4">
                  <p className="text-red-400 text-sm font-medium text-center">{errorMessage}</p>
                </div>
                <Button
                  onClick={() => setPaymentStatus("idle")}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl"
                >
                  Réessayer
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
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

            {/* Name Input(s) */}
            {isFiveQueens ? (
              <div className="space-y-4">
                <Label className="text-platinum/80 text-sm tracking-wide flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Noms des 5 Queens
                </Label>
                {formData.fullNames.map((name, index) => (
                  <div key={index} className="space-y-1">
                    <Input
                      placeholder={`Nom de la Queen ${index + 1}`}
                      value={name}
                      onChange={(e) => handleArrayNameChange(index, e.target.value)}
                      className={`bg-black/20 border-white/10 text-white placeholder:text-white/20 h-10 rounded-xl focus:border-neon-purple/50 focus:ring-neon-purple/20 transition-all ${errors.fullNames[index] ? "border-red-500/50" : ""}`}
                      disabled={paymentStatus !== "idle"}
                      required
                    />
                    {errors.fullNames[index] && <p className="text-red-400 text-xs">{errors.fullNames[index]}</p>}
                  </div>
                ))}
              </div>
            ) : (
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
                    disabled={paymentStatus !== "idle"}
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                </div>
                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
              </div>
            )}

            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-platinum/80 text-sm tracking-wide">Phone Number (Paiement)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+237 ..."
                value={formData.phone}
                onChange={handleInputChange}
                className={`bg-black/20 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:border-neon-purple/50 focus:ring-neon-purple/20 transition-all ${errors.phone ? "border-red-500/50" : ""}`}
                disabled={paymentStatus !== "idle"}
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
                  onClick={() => paymentStatus === "idle" && handleOperatorSelect("mtn")}
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
                  onClick={() => paymentStatus === "idle" && handleOperatorSelect("orange")}
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

            {/* General Form Error */}
            {errors.form && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-shake">
                <div className="p-1 bg-red-500/20 rounded-full">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-red-500 font-bold text-sm">Échec du paiement</h4>
                  <p className="text-red-400 text-xs mt-0.5">{errors.form}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold tracking-wider py-6 rounded-xl shadow-lg shadow-purple-900/40 transition-all hover:scale-[1.02] mt-4"
              disabled={paymentStatus !== "idle"}
            >
              Confirmer le Paiement
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
