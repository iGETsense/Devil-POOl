"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Sparkles, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Do not render navbar on admin pages
    if (pathname?.startsWith("/admin")) return null

    return (
        <nav className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? "top-6" : "top-0"
            }`}>
            <div className={`mx-auto px-4 transition-all duration-500 ease-in-out ${scrolled ? "max-w-5xl" : "max-w-7xl"
                }`}>
                <div className={`
          flex items-center justify-between px-6 transition-all duration-500 ease-in-out
          ${scrolled
                        ? 'h-16 md:h-20 rounded-full bg-space-dark/80 backdrop-blur-xl border border-neon-purple/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                        : 'h-24 bg-transparent border border-transparent'
                    }
        `}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <span
                            className="text-2xl md:text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-white drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                            style={{ fontFamily: "var(--font-inter), sans-serif", textShadow: "0 0 20px rgba(168,85,247,0.5)" }}
                        >
                            GENESIS
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">
                            Acceuil
                        </Link>
                        <Link href="/passes" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">
                            Passes
                        </Link>
                        {/* Feature: Check Ticket - Could link to a lookup page or just be a placeholder for now */}
                        <Link href="/passes" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">
                            Voir mon Ticket
                        </Link>
                    </div>

                    <Link href="/passes">
                        <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-6 backdrop-blur-md transition-all">
                            Réserver
                        </Button>
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white p-2"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="bg-space-dark/98 backdrop-blur-xl border-t border-neon-purple/20 px-4 py-4 space-y-2">
                    <Link
                        href="/"
                        className="block py-3 px-4 text-platinum hover:bg-neon-purple/10 rounded-lg transition-all"
                        onClick={() => setIsOpen(false)}
                    >
                        Accueil
                    </Link>
                    <Link
                        href="/passes"
                        className="block py-3 px-4 text-platinum hover:bg-neon-purple/10 rounded-lg transition-all"
                        onClick={() => setIsOpen(false)}
                    >
                        Passes
                    </Link>
                    <Link
                        href="/passes"
                        className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-royal-purple to-neon-purple text-white rounded-full font-semibold"
                        onClick={() => setIsOpen(false)}
                    >
                        <Ticket className="w-4 h-4" />
                        Réserver maintenant
                    </Link>
                </div>
            </div>
        </nav>
    )
}
