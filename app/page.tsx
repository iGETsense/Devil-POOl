import Link from "next/link"
import Image from "next/image"
import { Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--space-dark)" }}>
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-end overflow-hidden pb-20">
        <Image 
          src="/hero-black-women-pool-3.jpg" 
          alt="Genesis Exclusive Event" 
          fill 
          className="object-cover" 
          priority 
          style={{
            filter: "saturate(1.4) contrast(1.2) brightness(0.85) hue-rotate(260deg)",
            mixBlendMode: "normal"
          }}
        />
        {/* Purple neon color overlay for cosmic theme */}
        <div className="absolute inset-0 bg-[var(--neon-purple)]/20 mix-blend-color" />
        <div className="absolute inset-0 bg-[var(--cosmic-blue)]/25 mix-blend-multiply" />
        {/* Minimal gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--space-dark)]/60" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 gold-text drop-shadow-2xl"
            style={{
              fontFamily: "var(--font-playfair), serif",
              textShadow: "0 0 30px rgba(192, 132, 252, 0.6), 0 0 60px rgba(192, 132, 252, 0.4)",
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
            className="inline-block px-8 py-4 bg-transparent text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-[var(--neon-purple)]/50 transition-all duration-300 transform hover:scale-105 elegant-border"
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
