"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Flame, Zap } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[var(--neon-red)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <div className="text-2xl md:text-3xl font-bold tracking-wider">
              <span className="gold-text flex items-center gap-2" style={{ fontFamily: "var(--font-gothic), serif" }}>
                <Flame className="text-[var(--neon-red)] w-6 h-6 md:w-7 md:h-7" />
                <span className="relative">
                  <Zap className="absolute -top-2 -left-1 text-[var(--neon-red)] w-3 h-3 md:w-4 md:h-4" />
                  Demon Time
                  <Zap className="absolute -top-2 -right-1 text-[var(--neon-red)] w-3 h-3 md:w-4 md:h-4" />
                </span>
                <Flame className="text-[var(--neon-red)] w-6 h-6 md:w-7 md:h-7" />
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-[var(--gold)] transition-colors duration-300 font-medium">
              Accueil
            </Link>
            <Link
              href="/passes"
              className="text-white hover:text-[var(--gold)] transition-colors duration-300 font-medium"
            >
              Passes
            </Link>
            <Link
              href="/reservation"
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--neon-red)] to-[var(--neon-pink)] text-white rounded-full font-semibold hover:shadow-lg hover:shadow-[var(--neon-red)]/50 transition-all duration-300 flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              Réserver
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-[var(--neon-red)]/30">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-white hover:text-[var(--gold)] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/passes"
              className="block py-2 text-white hover:text-[var(--gold)] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Passes
            </Link>
            <Link
              href="/reservation"
              className="block py-3 px-6 bg-gradient-to-r from-[var(--neon-red)] to-[var(--neon-pink)] text-white rounded-full font-semibold text-center flex items-center justify-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Flame className="w-4 h-4" />
              Réserver
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
