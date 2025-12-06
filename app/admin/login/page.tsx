"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, Sparkles } from "lucide-react"
import { getFirebaseAuth } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Sign in with Firebase Authentication
      const auth = getFirebaseAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Get ID token
      const idToken = await user.getIdToken()

      // Verify admin access via API route
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store ID token for API requests
        sessionStorage.setItem("adminToken", idToken)
        sessionStorage.setItem("adminAuth", "true")
        router.push("/admin/dashboard")
      } else {
        // Sign out if not authorized
        await auth.signOut()
        setError(data.message || "Accès non autorisé")
        setIsLoading(false)
      }
    } catch (err: unknown) {
      console.error("Login error:", err)
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue"

      // Handle specific Firebase errors
      if (errorMessage.includes("user-not-found")) {
        setError("Utilisateur non trouvé")
      } else if (errorMessage.includes("wrong-password")) {
        setError("Mot de passe incorrect")
      } else if (errorMessage.includes("invalid-email")) {
        setError("Email invalide")
      } else if (errorMessage.includes("too-many-requests")) {
        setError("Trop de tentatives. Réessayez plus tard.")
      } else {
        setError("Erreur de connexion. Vérifiez vos identifiants.")
      }
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-24 flex items-center justify-center px-4" style={{ backgroundColor: "var(--space-dark)" }}>
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-pulse" style={{ backgroundColor: "rgba(192, 132, 252, 0.2)", border: "4px solid var(--neon-purple)" }}>
            <Lock className="w-10 h-10" style={{ color: "var(--neon-purple)" }} />
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-2 gold-text"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Administration
          </h1>
          <p className="text-lg" style={{ color: "var(--platinum)", opacity: 0.6 }}>Genesis Event Manager</p>
        </div>

        {/* Login Form */}
        <div className="rounded-3xl overflow-hidden border-2 border-[var(--platinum)]/40 bg-gradient-to-b from-[var(--cosmic-blue)]/90 to-[var(--space-dark)]/70 backdrop-blur-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: "var(--platinum)", opacity: 0.8 }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--platinum)", opacity: 0.5 }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@genesis.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none transition-all"
                  style={{ backgroundColor: "rgba(15, 20, 25, 0.5)", border: "2px solid rgba(229, 228, 226, 0.2)", color: "var(--platinum)" }}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: "var(--platinum)", opacity: 0.8 }}>
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--platinum)", opacity: 0.5 }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                  className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none transition-all"
                  style={{ backgroundColor: "rgba(15, 20, 25, 0.5)", border: "2px solid rgba(229, 228, 226, 0.2)", color: "var(--platinum)" }}
                  required
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
              className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${isLoading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[var(--cosmic-blue)] to-[var(--deep-purple)] hover:shadow-2xl hover:shadow-[var(--neon-purple)]/40 transform hover:scale-105"
                }`}
              style={!isLoading ? { color: "var(--platinum)" } : {}}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connexion...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-center" style={{ color: "var(--platinum)", opacity: 0.4 }}>
              Accès réservé aux administrateurs Genesis uniquement
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm transition-colors" style={{ color: "var(--platinum)", opacity: 0.6 }}>
            ← Retour à l&apos;accueil
          </a>
        </div>
      </div>
    </main>
  )
}
