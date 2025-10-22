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
      id: "DT-2025-ABC123",
      name: "Jean Dupont",
      phone: "+237 6XX XXX XXX",
      passType: "ONE MAN",
      price: "15 000 FCFA",
      bookingDate: "2025-10-20",
      qrCode: "DT-PASS-ABC123",
      scanned: true,
      scanTime: "2025-10-22 20:30"
    },
    {
      id: "DT-2025-DEF456",
      name: "Marie Kamga",
      phone: "+237 6YY YYY YYY",
      passType: "ONE LADY",
      price: "10 000 FCFA",
      bookingDate: "2025-10-21",
      qrCode: "DT-PASS-DEF456",
      scanned: false
    },
    {
      id: "DT-2025-GHI789",
      name: "Sophie & Friends",
      phone: "+237 6ZZ ZZZ ZZZ",
      passType: "FIVE QUEENS",
      price: "5 000 FCFA",
      bookingDate: "2025-10-21",
      qrCode: "DT-PASS-GHI789",
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
    <main className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-3xl md:text-4xl font-bold gold-text mb-2"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Dashboard Admin
            </h1>
            <p className="text-white/60">Gestion de l&apos;événement Demon Time</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-900/50 hover:bg-red-900 text-white rounded-full transition-all"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border-2 border-[#ff3366] bg-gradient-to-b from-black/90 to-black/70 p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-[#ff3366]" />
              <span className="text-3xl font-bold gold-text">{stats.total}</span>
            </div>
            <p className="text-white/60 text-sm">Total Invités</p>
          </div>

          <div className="rounded-2xl border-2 border-green-500 bg-gradient-to-b from-black/90 to-black/70 p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-green-500">{stats.scanned}</span>
            </div>
            <p className="text-white/60 text-sm">Entrées Validées</p>
          </div>

          <div className="rounded-2xl border-2 border-yellow-500 bg-gradient-to-b from-black/90 to-black/70 p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-yellow-500" />
              <span className="text-3xl font-bold text-yellow-500">{stats.pending}</span>
            </div>
            <p className="text-white/60 text-sm">En Attente</p>
          </div>

          <div className="rounded-2xl border-2 border-[#ffcc00] bg-gradient-to-b from-black/90 to-black/70 p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-[#ffcc00]" />
              <span className="text-2xl font-bold gold-text">{stats.revenue.toLocaleString()}</span>
            </div>
            <p className="text-white/60 text-sm">Revenus (FCFA)</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === "scan"
                ? "bg-gradient-to-r from-red-900 to-red-700 text-white shadow-lg shadow-red-500/50"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            <QrCode className="w-5 h-5" />
            Scanner QR Code
          </button>
          <button
            onClick={() => setActiveTab("guests")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === "guests"
                ? "bg-gradient-to-r from-red-900 to-red-700 text-white shadow-lg shadow-red-500/50"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            <Users className="w-5 h-5" />
            Liste des Invités
          </button>
        </div>

        {activeTab === "scan" ? (
          <div className="rounded-3xl border-4 border-[#ff3366] bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm p-8">
            <h2 className="text-2xl font-bold gold-text mb-6 text-center" style={{ fontFamily: "var(--font-cinzel), serif" }}>
              Scanner un QR Code
            </h2>

            <div className="max-w-2xl mx-auto mb-8">
              <button
                onClick={() => setShowScanner(true)}
                className="w-full py-8 bg-gradient-to-r from-red-900 to-red-700 text-white text-xl font-semibold rounded-2xl hover:from-red-800 hover:to-red-600 transition-all shadow-2xl hover:shadow-red-500/50 flex items-center justify-center gap-4"
              >
                <Camera className="w-8 h-8" />
                Ouvrir la Caméra
              </button>
              <p className="text-white/60 text-center mt-4">
                Cliquez pour activer la caméra et scanner un QR code
              </p>
            </div>

            {scanResult && (
              <div className={`max-w-2xl mx-auto p-6 rounded-2xl border-4 ${
                scanResult.valid ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
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
                      <div className="space-y-2 text-white/80">
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
          <div className="rounded-3xl border-4 border-[#ff3366] bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gold-text" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                Liste des Invités ({filteredGuests.length})
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 bg-black/50 border-2 border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#ff3366] focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-white/20">
                    <th className="text-left py-4 px-4 text-white/80 font-semibold">ID</th>
                    <th className="text-left py-4 px-4 text-white/80 font-semibold">Nom</th>
                    <th className="text-left py-4 px-4 text-white/80 font-semibold">Téléphone</th>
                    <th className="text-left py-4 px-4 text-white/80 font-semibold">Pass</th>
                    <th className="text-left py-4 px-4 text-white/80 font-semibold">Prix</th>
                    <th className="text-left py-4 px-4 text-white/80 font-semibold">Date</th>
                    <th className="text-center py-4 px-4 text-white/80 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-white/60 font-mono text-sm">{guest.id}</td>
                      <td className="py-4 px-4 text-white font-semibold">{guest.name}</td>
                      <td className="py-4 px-4 text-white/60">{guest.phone}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-[#ff3366]/20 text-[#ff3366] rounded-full text-sm font-semibold">
                          {guest.passType}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white font-semibold">{guest.price}</td>
                      <td className="py-4 px-4 text-white/60">{guest.bookingDate}</td>
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
