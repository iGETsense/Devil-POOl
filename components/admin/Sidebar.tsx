"use client"

import { Home, Users, Smartphone, Calendar, BarChart2, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
    onItemClick?: () => void
}

export default function Sidebar({ onItemClick }: SidebarProps) {
    const pathname = usePathname()

    const menuItems = [
        { icon: Home, label: "Vue d'ensemble", path: "/admin/dashboard" },
        { icon: Users, label: "Réservations", path: "/admin/guests" },
        { icon: Smartphone, label: "Scanner Billet", path: "/admin/scanner" },
    ]

    return (
        <div className="h-full flex flex-col p-6">
            {/* Brand (Desktop only in sidebar) */}
            <div className="flex items-center gap-3 mb-10 px-2 hidden md:flex">
                <div className="w-8 h-8 rounded bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white">N</div>
                <span className="text-white font-bold text-xl tracking-wide">NIGHTADMIN</span>
            </div>

            {/* Brand (Mobile only in sidebar - extra padding) */}
            <div className="flex md:hidden items-center gap-3 mb-8 px-2">
                <span className="text-gray-500 font-medium text-sm">Menu Navigation</span>
            </div>

            {/* Menu */}
            <nav className="space-y-2 flex-1">
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.path || (item.path !== "/admin/dashboard" && pathname.startsWith(item.path))

                    return (
                        <Link
                            key={index}
                            href={item.path}
                            onClick={onItemClick}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Logout / Bottom optional */}
            <div className="mt-auto pt-6 border-t border-white/5">
                <p className="text-xs text-gray-500 text-center">v1.2.0 Genesis Mobile</p>
            </div>
        </div>
    )
}
