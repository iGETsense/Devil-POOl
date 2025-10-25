import Link from "next/link"
import Image from "next/image"
import { Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--navy)" }}>
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-end overflow-hidden pb-20">
        <Image src="/hero-pool-elegant.jpg" alt="Genesis Exclusive Event" fill className="object-cover" priority />
        {/* Elegant blue overlay matching theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--deep-blue)]/60 via-[var(--navy)]/40 to-[var(--navy)]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-blue)]/10 to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 gold-text drop-shadow-2xl"
            style={{
              fontFamily: "var(--font-playfair), serif",
              textShadow: "0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.3)",
            }}
          >
            Bienvenue dans l&apos;univers Genesis.
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--platinum)" }}>
            Découvrez l&apos;excellence et le raffinement. Réservez votre pass, recevez votre QR unique, et
            préparez-vous à vivre une expérience d&apos;exception en Novembre 2025. Les places sont limitées. Pas de QR, pas
            d&apos;entrée. L&apos;élégance dans sa forme la plus pure.
          </p>
          <Link
            href="/reservation"
            className="inline-block px-8 py-4 bg-transparent text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-[var(--champagne-gold)]/50 transition-all duration-300 transform hover:scale-105 elegant-border"
            style={{ color: "var(--platinum)" }}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Je réserve maintenant
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}
