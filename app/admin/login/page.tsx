"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Flame } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mot de passe prédéfini (sera remplacé par une vérification backend)
  const ADMIN_PASSWORD = "DemonTime2025"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulation de vérification
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Stocker la session admin
        sessionStorage.setItem("adminAuth", "true")
        router.push("/admin/dashboard")
      } else {
        setError("Mot de passe incorrect")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#ff3366]/20 border-4 border-[#ff3366] mb-6 animate-pulse">
            <Lock className="w-10 h-10 text-[#ff3366]" />
          </div>
          <h1 
            className="text-4xl md:text-5xl font-bold mb-2 gold-text"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            Administration
          </h1>
          <p className="text-white/60 text-lg">Demon Time Event Manager</p>
        </div>

        {/* Login Form */}
        <div className="rounded-3xl overflow-hidden border-4 border-[#ff3366] bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-3">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                  className="w-full pl-12 pr-4 py-4 bg-black/50 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-[#ff3366] focus:outline-none transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border-2 border-red-500 rounded-xl text-red-400 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-900 to-red-700 text-white hover:from-red-800 hover:to-red-600 hover:shadow-2xl hover:shadow-red-500/50 transform hover:scale-105"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Vérification...
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5" />
                  Accéder au Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/40 text-xs text-center">
              Accès réservé aux administrateurs Demon Time uniquement
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-white/60 hover:text-[#ff3366] transition-colors text-sm">
            ← Retour à l&apos;accueil
          </a>
        </div>
      </div>
    </main>
  )
}
