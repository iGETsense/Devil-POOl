"use client"

import { Home, Users, Smartphone, Calendar, BarChart2, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Sidebar() {
    const menuItems = [
        { icon: Home, label: "Tableau de Bord", active: true },
        { icon: Users, label: "Invités", active: false },
        { icon: Smartphone, label: "Scanner", active: false },
        { icon: Calendar, label: "Événements", active: false },
        { icon: BarChart2, label: "Rapports", active: false },
        { icon: Settings, label: "Paramètres", active: false },
    ]

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-[#0a0118] border-r border-white/5 flex flex-col p-6 z-50">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-8 h-8 rounded bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white">N</div>
                <span className="text-white font-bold text-xl tracking-wide">NIGHTADMIN</span>
            </div>

            {/* Menu */}
            <nav className="space-y-2 flex-1">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${item.active
                                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${item.active ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Logout / Bottom optional */}
            <div className="mt-auto pt-6 border-t border-white/5">
                <p className="text-xs text-gray-500 text-center">v1.0.0 Genesis Admin</p>
            </div>
        </aside>
    )
}
