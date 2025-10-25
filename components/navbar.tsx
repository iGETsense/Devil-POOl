"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Sparkles } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--navy)]/90 backdrop-blur-md border-b border-[var(--platinum)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <div className="text-2xl md:text-3xl font-bold tracking-wider">
              <span className="gold-text flex items-center gap-3" style={{ fontFamily: "var(--font-playfair), serif" }}>
                <Sparkles className="text-[var(--champagne-gold)] w-6 h-6 md:w-7 md:h-7" />
                <span className="relative">
                  Genesis
                </span>
                <Sparkles className="text-[var(--champagne-gold)] w-6 h-6 md:w-7 md:h-7" />
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[var(--platinum)] hover:text-[var(--champagne-gold)] transition-colors duration-300 font-medium">
              Accueil
            </Link>
            <Link
              href="/passes"
              className="text-[var(--platinum)] hover:text-[var(--champagne-gold)] transition-colors duration-300 font-medium"
            >
              Passes
            </Link>
            <Link
              href="/reservation"
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--deep-blue)] to-[var(--accent-blue)] text-[var(--platinum)] rounded-full font-semibold hover:shadow-lg hover:shadow-[var(--champagne-gold)]/30 transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Réserver
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[var(--platinum)] p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[var(--navy)]/95 border-t border-[var(--platinum)]/20">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-[var(--platinum)] hover:text-[var(--champagne-gold)] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/passes"
              className="block py-2 text-[var(--platinum)] hover:text-[var(--champagne-gold)] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Passes
            </Link>
            <Link
              href="/reservation"
              className="block py-3 px-6 bg-gradient-to-r from-[var(--deep-blue)] to-[var(--accent-blue)] text-[var(--platinum)] rounded-full font-semibold text-center flex items-center justify-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Sparkles className="w-4 h-4" />
              Réserver
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
