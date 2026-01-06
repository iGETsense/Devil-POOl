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
        localStorage.setItem("adminToken", idToken)
        localStorage.setItem("adminAuth", "true")
        // Also keep session for backward comp if needed, but local is priority
        sessionStorage.setItem("adminToken", idToken)
        router.push("/admin-88y12d/dashboard")
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
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#020617]">

      {/* Animated Background Layers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(76,29,149,0.1),_transparent_70%)] animate-pulse duration-[5000ms]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-bounce duration-[10000ms]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">

        {/* Logo/Title */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-12 duration-1000 flex flex-col items-center">
          <div className="relative w-40 h-40 mb-6 transition-transform hover:scale-105 duration-500">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/genesis-logo.jpg"
              alt="Genesis Logo"
              className="relative z-10 w-full h-full object-contain rounded-full border-4 border-purple-500/30 shadow-2xl"
            />
          </div>
          <h1
            className="text-4xl font-bold mb-3 text-white drop-shadow-lg"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Administration
          </h1>
          <p className="text-lg text-purple-200/60 font-light tracking-widest uppercase text-[10px]">Genesis Event Manager</p>
        </div>

        {/* Login Form Card */}
        <div className="w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Field */}
            <div className="space-y-2 group">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider pl-4 group-focus-within:text-purple-400 transition-colors">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@genesis.com"
                  className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all shadow-inner"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 group">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider pl-4 group-focus-within:text-purple-400 transition-colors">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-center text-sm animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 rounded-2xl font-bold text-lg tracking-wide transition-all duration-500 flex items-center justify-center gap-2 group relative overflow-hidden ${isLoading
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-[1.02]"
                }`}
            >
              {/* Button Shine Effect */}
              {!isLoading && (
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              )}

              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
              Accès Sécurisé • Admin Only
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 animate-in fade-in delay-500 duration-1000">
          <a href="/" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2 opacity-60 hover:opacity-100">
            <span>←</span> Retour à l&apos;accueil
          </a>
        </div>
      </div>
    </main>
  )
}
