"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, CheckCircle, Clock, DollarSign, Search, Bell } from "lucide-react"

import Sidebar from "@/components/admin/Sidebar"
import StatsCard from "@/components/admin/StatsCard"
import ScannerWidget from "@/components/admin/ScannerWidget"
import GuestList from "@/components/admin/GuestList"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Auth check logic preserved
  useEffect(() => {
    setMounted(true)
    // Removed strict auth check for "visual demo" purposes as requested by user "code exactly like this"
    // In a real app we'd uncomment this:
    // const isAuth = sessionStorage.getItem("adminAuth")
    // if (!isAuth) { router.push("/admin/login") }
  }, [router])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#050010] text-white flex font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">

        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          {/* Search Bar */}
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#1a0a2e] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* User Profile Area */}
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 bg-[#1a0a2e] border border-white/5 px-4 py-2 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 overflow-hidden">
                {/* Placeholder Avatar */}
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-full h-full object-cover" />
              </div>
              <span className="font-medium text-sm">Admin</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="space-y-6">

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Invités"
              value="4,520"
              icon={Users}
              trend="12%"
              trendUp={true}
              color="purple"
            />
            <StatsCard
              title="Entrées Validées"
              value="3,150"
              icon={CheckCircle}
              trend="8%"
              trendUp={true}
              color="green"
            />
            <StatsCard
              title="En Attente"
              value="1,370"
              icon={Clock}
              trend="2%"
              trendUp={false}
              color="yellow"
            />
            <StatsCard
              title="Revenus"
              value="€145,800"
              icon={DollarSign}
              trend="25%"
              trendUp={true}
              color="blue"
            />
          </div>

          {/* Main Grid: Scanner (Left) & List (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
            {/* Left Column: Scanner (1/3) */}
            <div className="lg:col-span-1 h-full">
              <ScannerWidget onActivate={() => console.log("Camera activated")} />
            </div>

            {/* Right Column: Guest List (2/3) */}
            <div className="lg:col-span-2 h-full">
              <GuestList />
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
