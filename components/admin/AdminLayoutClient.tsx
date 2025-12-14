"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/admin/Sidebar"
import { Menu, X } from "lucide-react"

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()

    // Full screen layout for Login page
    if (pathname.includes("/login")) {
        return (
            <div className="min-h-screen bg-[#020617] text-white">
                {children}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar with mobile classes */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0118] border-r border-white/5 transition-transform duration-300 md:translate-x-0 md:static md:inset-auto
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full md:max-w-[calc(100%-16rem)] flex flex-col min-h-screen relative">

                {/* Mobile Header Toggle */}
                <div className="md:hidden sticky top-0 z-30 bg-[#0a0118]/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white">N</div>
                        <span className="text-white font-bold text-lg">NIGHTADMIN</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg"
                    >
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                </div>

                <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    )
}
