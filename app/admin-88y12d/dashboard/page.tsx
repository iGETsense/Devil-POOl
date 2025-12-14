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

      // Fetch Stats
      const statsRes = await fetch('/api/stats')
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

    } catch (error) {
      console.error("Failed to fetch dashboard data", error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  // Process Transactions from Guests (Filter Paid/Validated)
  const transactions: Transaction[] = guests
    .filter(g => g.status === 'paid' || g.status === 'validated')
    .sort((a, b) => (b.paidAt || 0) - (a.paidAt || 0))
    .slice(0, 10) // Last 10
    .map(g => ({
      id: g.id,
      bookingId: g.id,
      customer: g.fullName,
      amount: g.price,
      method: g.operator || 'orange',
      type: 'payment',
      status: 'success',
      timestamp: g.paidAt || g.createdAt
    }))

  // Map guests to display format
  const displayGuests = guests
    .filter(g =>
      g.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(g => ({
      id: g.id,
      name: g.fullName,
      passType: g.passType === "ONE_MAN" ? "Standard" : g.passType === "ONE_LADY" ? "Lady" : "Queen",
      status: (g.status === "validated" ? "Validé" : g.status === "paid" ? "Payé" : g.status === "pending" ? "En Attente" : "Annulé") as Guest["status"]
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
            onClick={fetchData}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1a0a2e] border border-white/10 text-gray-400 hover:text-white transition-colors hover:border-purple-500/50"
            title="Rafraîchir"
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
            <TransactionFeed transactions={transactions} />
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
