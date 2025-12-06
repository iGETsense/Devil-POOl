"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { QrCode, Users, LogOut, CheckCircle, XCircle, Search, Calendar, DollarSign, Camera } from "lucide-react"
import dynamic from "next/dynamic"

const QRScanner = dynamic(() => import("@/components/qr-scanner"), { ssr: false })

interface Guest {
  id: string
  name: string
  phone: string
  passType: string
  price: string
  bookingDate: string
  qrCode: string
  scanned: boolean
  scanTime?: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"scan" | "guests">("scan")
  const [showScanner, setShowScanner] = useState(false)
  const [scanResult, setScanResult] = useState<{ valid: boolean; guest?: Guest; message: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)

  const [guests] = useState<Guest[]>([
    {
      id: "GEN-2025-ABC123",
      name: "Jean Dupont",
      phone: "+237 6XX XXX XXX",
      passType: "ONE MAN",
      price: "15 000 FCFA",
      bookingDate: "2025-10-20",
      qrCode: "GEN-PASS-ABC123",
      scanned: true,
      scanTime: "2025-10-22 20:30"
    },
    {
      id: "GEN-2025-DEF456",
      name: "Marie Kamga",
      phone: "+237 6YY YYY YYY",
      passType: "ONE LADY",
      price: "10 000 FCFA",
      bookingDate: "2025-10-21",
      qrCode: "GEN-PASS-DEF456",
      scanned: false
    },
    {
      id: "GEN-2025-GHI789",
      name: "Sophie & Friends",
      phone: "+237 6ZZ ZZZ ZZZ",
      passType: "FIVE QUEENS",
      price: "5 000 FCFA",
      bookingDate: "2025-10-21",
      qrCode: "GEN-PASS-GHI789",
      scanned: false
    }
  ])

  useEffect(() => {
    setMounted(true)
    const isAuth = sessionStorage.getItem("adminAuth")
    if (!isAuth) {
      router.push("/admin/login")
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  const handleScanQR = (data: string) => {
    // Stocker TOUTES les données scannées dans une variable
    const scannedQRData = data

    // Log détaillé pour debug
    console.log("🔍 Validation du QR Code...")
    console.log("📦 Données reçues:", scannedQRData)
    console.log("📊 Type de données:", typeof scannedQRData)
    console.log("📏 Longueur:", scannedQRData.length)

    // Chercher dans la base de données (actuellement demo data)
    // Recherche flexible: par QR code OU par ID
    const guest = guests.find(g =>
      g.qrCode === scannedQRData ||
      g.id === scannedQRData ||
      g.qrCode.includes(scannedQRData) ||
      scannedQRData.includes(g.qrCode)
    )

    if (guest) {
      // QR Code VALIDE trouvé dans la base
      console.log("✅ Invité trouvé:", guest.name)

      if (guest.scanned) {
        // Déjà scanné - REFUSER l'entrée
        console.log("⚠️ ATTENTION: Déjà scanné le", guest.scanTime)
        setScanResult({
          valid: false,
          guest,
          message: "⚠️ Ce QR code a déjà été scanné !"
        })
      } else {
        // Première fois - AUTORISER l'entrée
        console.log("🎉 ACCÈS AUTORISÉ")
        setScanResult({
          valid: true,
          guest,
          message: "✅ QR Code valide ! Accès autorisé"
        })

        // TODO: Ici, appeler l'API backend pour marquer comme scanné
        // fetch('/api/admin/validate-qr', {
        //   method: 'POST',
        //   body: JSON.stringify({ qrCode: scannedQRData })
        // })
      }
    } else {
      // QR Code INVALIDE - pas dans la base
      console.log("❌ QR Code non trouvé dans la base de données")
      console.log("🔍 Données recherchées:", scannedQRData)
      setScanResult({
        valid: false,
        message: "❌ QR Code invalide ou introuvable"
      })
    }

    // Fermer le scanner
    setShowScanner(false)
  }

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  )

  const stats = {
    total: guests.length,
    scanned: guests.filter(g => g.scanned).length,
    pending: guests.filter(g => !g.scanned).length,
    revenue: guests.reduce((sum, g) => sum + parseInt(g.price.replace(/\D/g, "")), 0)
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen pt-24 py-8 px-4" style={{ backgroundColor: "var(--space-dark)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold gold-text mb-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Dashboard Admin
            </h1>
            <p style={{ color: "var(--platinum)", opacity: 0.6 }}>Gestion de l&apos;événement Genesis</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-full transition-all"
            style={{ backgroundColor: "rgba(26, 35, 50, 0.5)", color: "var(--platinum)" }}
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-gradient-to-b from-[var(--cosmic-blue)]/90 to-[var(--space-dark)]/70 p-6" style={{ border: "2px solid var(--platinum)", opacity: 0.4 }}>
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8" style={{ color: "var(--neon-purple)" }} />
              <span className="text-3xl font-bold gold-text">{stats.total}</span>
            </div>
            <p className="text-sm" style={{ color: "var(--platinum)", opacity: 0.6 }}>Total Invités</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-[var(--cosmic-blue)]/90 to-[var(--space-dark)]/70 p-6" style={{ border: "2px solid #10b981" }}>
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-green-500">{stats.scanned}</span>
            </div>
            <p className="text-sm" style={{ color: "var(--platinum)", opacity: 0.6 }}>Entrées Validées</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-[var(--cosmic-blue)]/90 to-[var(--space-dark)]/70 p-6" style={{ border: "2px solid #eab308" }}>
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-yellow-500" />
              <span className="text-3xl font-bold text-yellow-500">{stats.pending}</span>
            </div>
            <p className="text-sm" style={{ color: "var(--platinum)", opacity: 0.6 }}>En Attente</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-[var(--cosmic-blue)]/90 to-[var(--space-dark)]/70 p-6" style={{ border: "2px solid var(--neon-purple)" }}>
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8" style={{ color: "var(--neon-purple)" }} />
              <span className="text-2xl font-bold gold-text">{stats.revenue.toLocaleString()}</span>
            </div>
            <p className="text-sm" style={{ color: "var(--platinum)", opacity: 0.6 }}>Revenus (FCFA)</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === "scan"
                ? "bg-gradient-to-r from-[var(--cosmic-blue)] to-[var(--deep-purple)] shadow-lg"
                : "hover:bg-white/20"
              }`}
            style={activeTab === "scan" ? { color: "var(--platinum)", boxShadow: "0 0 20px rgba(192, 132, 252, 0.5)" } : { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "rgba(229, 228, 226, 0.6)" }}
          >
            <QrCode className="w-5 h-5" />
            Scanner QR Code
          </button>
          <button
            onClick={() => setActiveTab("guests")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === "guests"
                ? "bg-gradient-to-r from-[var(--cosmic-blue)] to-[var(--deep-purple)] shadow-lg"
                : "hover:bg-white/20"
              }`}
            style={activeTab === "guests" ? { color: "var(--platinum)", boxShadow: "0 0 20px rgba(192, 132, 252, 0.5)" } : { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "rgba(229, 228, 226, 0.6)" }}
          >
            <Users className="w-5 h-5" />
            Liste des Invités
          </button>
        </div>

        {activeTab === "scan" ? (
          <div className="rounded-3xl elegant-border bg-gradient-to-b from-[var(--cosmic-blue)]/90 to-[var(--space-dark)]/70 backdrop-blur-sm p-8">
            <h2 className="text-2xl font-bold gold-text mb-6 text-center" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Scanner un QR Code
            </h2>

            <div className="max-w-2xl mx-auto mb-8">
              <button
                onClick={() => setShowScanner(true)}
                className="w-full py-8 bg-gradient-to-r from-[var(--cosmic-blue)] to-[var(--deep-purple)] text-xl font-semibold rounded-2xl transition-all shadow-2xl hover:shadow-[var(--neon-purple)]/50 flex items-center justify-center gap-4"
                style={{ color: "var(--platinum)" }}
              >
                <Camera className="w-8 h-8" />
                Ouvrir la Caméra
              </button>
              <p className="text-center mt-4" style={{ color: "var(--platinum)", opacity: 0.6 }}>
                Cliquez pour activer la caméra et scanner un QR code
              </p>
            </div>

            {scanResult && (
              <div className={`max-w-2xl mx-auto p-6 rounded-2xl border-4 ${scanResult.valid ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
                }`}>
                <div className="flex items-start gap-4">
                  {scanResult.valid ? (
                    <CheckCircle className="w-12 h-12 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-xl font-bold mb-3 ${scanResult.valid ? "text-green-500" : "text-red-500"}`}>
                      {scanResult.message}
                    </p>
                    {scanResult.guest && (
                      <div className="space-y-2" style={{ color: "var(--platinum)", opacity: 0.8 }}>
                        <p><strong>Nom:</strong> {scanResult.guest.name}</p>
                        <p><strong>Pass:</strong> {scanResult.guest.passType}</p>
                        <p><strong>ID:</strong> {scanResult.guest.id}</p>
                        {scanResult.guest.scanned && scanResult.guest.scanTime && (
                          <p className="text-yellow-500"><strong>Scanné le:</strong> {scanResult.guest.scanTime}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl elegant-border bg-gradient-to-b from-[var(--cosmic-blue)]/90 to-[var(--space-dark)]/70 backdrop-blur-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gold-text" style={{ fontFamily: "var(--font-playfair), serif" }}>
                Liste des Invités ({filteredGuests.length})
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--platinum)", opacity: 0.5 }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                  style={{ backgroundColor: "rgba(15, 20, 25, 0.5)", border: "2px solid rgba(229, 228, 226, 0.2)", color: "var(--platinum)" }}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: "rgba(229, 228, 226, 0.2)" }}>
                    <th className="text-left py-4 px-4 font-semibold" style={{ color: "var(--platinum)", opacity: 0.8 }}>ID</th>
                    <th className="text-left py-4 px-4 font-semibold" style={{ color: "var(--platinum)", opacity: 0.8 }}>Nom</th>
                    <th className="text-left py-4 px-4 font-semibold" style={{ color: "var(--platinum)", opacity: 0.8 }}>Téléphone</th>
                    <th className="text-left py-4 px-4 font-semibold" style={{ color: "var(--platinum)", opacity: 0.8 }}>Pass</th>
                    <th className="text-left py-4 px-4 font-semibold" style={{ color: "var(--platinum)", opacity: 0.8 }}>Prix</th>
                    <th className="text-left py-4 px-4 font-semibold" style={{ color: "var(--platinum)", opacity: 0.8 }}>Date</th>
                    <th className="text-center py-4 px-4 font-semibold" style={{ color: "var(--platinum)", opacity: 0.8 }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: "rgba(229, 228, 226, 0.1)" }}>
                      <td className="py-4 px-4 font-mono text-sm" style={{ color: "var(--platinum)", opacity: 0.6 }}>{guest.id}</td>
                      <td className="py-4 px-4 font-semibold" style={{ color: "var(--platinum)" }}>{guest.name}</td>
                      <td className="py-4 px-4" style={{ color: "var(--platinum)", opacity: 0.6 }}>{guest.phone}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: "rgba(192, 132, 252, 0.2)", color: "var(--neon-purple)" }}>
                          {guest.passType}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold" style={{ color: "var(--platinum)" }}>{guest.price}</td>
                      <td className="py-4 px-4" style={{ color: "var(--platinum)", opacity: 0.6 }}>{guest.bookingDate}</td>
                      <td className="py-4 px-4 text-center">
                        {guest.scanned ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            Scanné
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-semibold">
                            <Calendar className="w-4 h-4" />
                            En attente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleScanQR}
          onClose={() => setShowScanner(false)}
        />
      )}
    </main>
  )
}
