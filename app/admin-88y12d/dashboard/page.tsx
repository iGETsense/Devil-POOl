"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, CheckCircle, Clock, DollarSign, Search, Bell, Loader2, ScanLine } from "lucide-react"
import Link from "next/link"

import StatsCard from "@/components/admin/StatsCard"
import GuestList, { Guest } from "@/components/admin/GuestList"
import TransactionFeed, { Transaction } from "@/components/admin/TransactionFeed"
import { toast } from "sonner"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // State
  const [searchTerm, setSearchTerm] = useState("")

  // Real Data State
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    revenueOrange: 0,
    revenueMTN: 0,
    validatedCount: 0,
    pendingCount: 0,
    paidCount: 0,
    lastUpdated: Date.now()
  })
  const [guests, setGuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      setLoading(true)

      // 1. Sync Pending Transactions Logic
      // Fire and forget - don't await blocking the UI for this
      fetch('/api/finance/sync').then(r => r.json()).then(d => {
        if (d.updated > 0) fetchData() // Reload data if updates found
      }).catch(e => console.error("Sync trigger error", e))

      // Fetch Stats (Force recalculation to ensure accuracy)
      const statsRes = await fetch('/api/stats?recalculate=true')
      const statsData = await statsRes.json()
      if (statsData.success) {
        setStats(statsData.stats)
      }

      // Fetch Guests
      const guestsRes = await fetch('/api/guests')
      const guestsData = await guestsRes.json()
      if (guestsData.success) {
        setGuests(guestsData.reservations)
      }

      // Fetch Real MeSomb Balance
      try {
        const balanceRes = await fetch('/api/finance/balance')
        const balanceData = await balanceRes.json()
        if (balanceData.success && balanceData.balance) {
          // Handle various response types (Array of accounts or direct object)
          let totalLive = 0
          const b = balanceData.balance

          // If array of accounts (common in some SDKs)
          if (Array.isArray(b)) {
            totalLive = b.reduce((acc: number, curr: any) => acc + (parseFloat(curr.balance) || 0), 0)
          } else if (typeof b === 'object' && b !== null) {
            // Try to find values by summing up known currencies or keys
            const values = Object.values(b)
            if (values.length > 0) {
              // Check if it's a simple key-value of numbers
              values.forEach((val: any) => {
                if (typeof val === 'number') totalLive += val
                else if (typeof val === 'string') totalLive += parseFloat(val)
              })
            }
          } else {
            totalLive = Number(b) || 0
          }

          if (totalLive > 0) {
            setStats(prev => ({ ...prev, totalRevenue: totalLive }))
          }
        }
      } catch (e) { console.error("Balance fetch error", e) }

    } catch (error) {
      console.error("Failed to fetch dashboard data", error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  // Process all Transactions (Pending, Failed, Paid)
  const transactions: Transaction[] = guests
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)) // Sort by newest first
    .slice(0, 15) // Show last 15
    .map(g => ({
      id: g.id,
      bookingId: g.id,
      customer: g.fullName,
      amount: g.price,
      method: g.operator || 'orange',
      type: 'payment',
      status: g.status === 'paid' ? 'success' : g.status === 'validated' ? 'validated' : g.status === 'pending' ? 'pending' : 'failed',
      timestamp: g.createdAt,
      transactionId: (g as any).transactionId // Assume this field exists on Guest/Booking from DB
    }))

  const handleVerifyPayment = async (bookingId: string) => {
    try {
      // Find the booking to get transaction ID is optional if implicit, 
      // but API route handles check via bookingId if implemented, or we need transactionId.
      // Current API /api/payment/status check accepts transactionId
      // Let's assume we can check by bookingId if transaction ID is saved in backend.

      const toastId = toast.loading("Vérification avec Mesomb...")

      const res = await fetch(`/api/payment/status?bookingId=${bookingId}`)
      const data = await res.json()

      if (data.status === "SUCCESS") {
        toast.success("Succès ! Paiement confirmé.", { id: toastId })
        fetchData() // Refresh data
      } else if (data.status === "FAILED") {
        toast.error(`Échec: ${data.message || "Paiement refusé"}`, { id: toastId })
      } else {
        // Still pending
        const msg = data.debug_detail || "Toujours en attente..."

        // Allow manual force if it's stuck without transaction ID
        if (msg.includes("Aucun Transaction ID")) {
          toast.error(
            <div className="flex flex-col gap-2">
              <span>{msg}</span>
              <button
                onClick={() => handleForcePay(bookingId)}
                className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
              >
                Forcer "Payé" (Manuel)
              </button>
            </div>
            , { id: toastId, duration: 5000 })
        } else {
          toast.info(`Statut: ${data.status}. ${msg}`, { id: toastId })
        }
      }
    } catch (error) {
      toast.error("Erreur lors de la vérification")
    }
  }

  const handleForcePay = async (bookingId: string) => {
    if (!confirm("Attention: Êtes-vous sûr de vouloir forcer ce statut à 'PAYÉ' ? Seulement si vous avez reçu l'argent.")) return

    try {
      const res = await fetch('/api/payment/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      })
      const d = await res.json()
      if (d.success) {
        toast.success("Forcé avec succès")
        fetchData()
      } else {
        toast.error("Erreur: " + d.message)
      }
    } catch (error) {
      toast.error("Erreur commande manuelle")
    }
  }

  // Map guests to display format
  const displayGuests = guests
    .filter(g =>
      g.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(g => ({
      id: g.id,
      name: g.fullName,
      passType: g.passType === "ONE_MAN" ? "ONE MAN" : g.passType === "ONE_LADY" ? "ONE LADY" : "FIVE QUEENS",
      status: (g.status === "validated" ? "Validé" : g.status === "paid" ? "Payé" : g.status === "pending" ? "En Attente" : "Annulé") as Guest["status"],
      entriesCount: g.entriesCount,
      totalEntries: g.totalEntries
    }))

  return (
    <>
      {/* Top Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Vue d'ensemble</h1>
          <p className="text-gray-400 text-sm">Suivi en temps réel des entrées et revenus</p>
        </div>

        {/* User Profile Area */}
        <div className="flex items-center gap-4">
          <Link href="/admin/scanner" className="hidden md:flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors">
            <ScanLine className="w-4 h-4" />
            <span>Ouvrir Scanner</span>
          </Link>

          <button
            onClick={() => fetchData()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1a0a2e] border border-white/10 text-gray-400 hover:text-white transition-colors hover:border-purple-500/50"
            title="Rafraîchir les données (Recalculer)"
          >
            <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-3 bg-[#1a0a2e] border border-white/10 px-2 pr-4 py-1.5 rounded-full">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-[1px]">
              <div className="w-full h-full rounded-full bg-black overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="font-medium text-sm text-white">Admin</span>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="space-y-6">

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Revenus Total"
            value={`${stats.totalRevenue.toLocaleString()} FCFA`}
            icon={DollarSign}
            trend="Live"
            trendUp={true}
            color="blue"
            subValues={[
              { label: "Orange", value: `${(stats.revenueOrange || 0).toLocaleString()} FCFA`, color: "text-orange-400" },
              { label: "MTN", value: `${(stats.revenueMTN || 0).toLocaleString()} FCFA`, color: "text-yellow-400" }
            ]}
          />
          <StatsCard
            title="Billets Validés"
            value={stats.validatedCount.toLocaleString()}
            icon={CheckCircle}
            trend={`${Math.round((stats.validatedCount / (stats.totalBookings || 1)) * 100)}%`}
            trendUp={true}
            color="green"
          />
          <StatsCard
            title="En Attente (Pending)"
            value={(stats.pendingCount).toLocaleString()}
            icon={Clock}
            trend="En attente scan"
            trendUp={false}
            color="yellow"
          />
          <StatsCard
            title="Total Réservations"
            value={stats.totalBookings.toLocaleString()}
            icon={Users}
            trend="Visiteurs"
            trendUp={true}
            color="purple"
          />
        </div>

        {/* Main Grid: Transactions (Left 40%) & List (Right 60%) - Enterprise Style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
          {/* Left Column: Realtime Transactions (4 cols) */}
          <div className="lg:col-span-5 h-full">
            <TransactionFeed transactions={transactions} onVerify={handleVerifyPayment} />
          </div>

          {/* Right Column: Guest Control List (8 cols) */}
          <div className="lg:col-span-7 h-full flex flex-col space-y-4">
            {/* Search in list header context */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un invité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a0a2e]/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <GuestList guests={displayGuests} />
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
