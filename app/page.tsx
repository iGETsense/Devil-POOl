import Link from "next/link"
import Image from "next/image"
import { Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--space-dark)" }}>
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-end overflow-hidden pb-20">
        <Image 
          src="/hero-pool-upscale.jpg" 
          alt="Genesis Exclusive Event" 
          fill 
          className="object-cover" 
          priority 
          style={{
            filter: "saturate(1.3) contrast(1.15) brightness(0.88) hue-rotate(255deg)",
            mixBlendMode: "normal"
          }}
        />
        {/* Subtle dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Elegant purple theme overlay */}
        <div className="absolute inset-0 bg-[var(--neon-purple)]/12 mix-blend-color" />
        <div className="absolute inset-0 bg-[var(--cosmic-blue)]/15 mix-blend-multiply" />
        {/* Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[var(--space-dark)]/70" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 gold-text drop-shadow-2xl animate-fade-in-up"
            style={{
              fontFamily: "var(--font-playfair), serif",
              textShadow: "0 0 30px rgba(192, 132, 252, 0.6), 0 0 60px rgba(192, 132, 252, 0.4)",
            }}
          >
            Genesis
          </h1>
          <p className="text-xl md:text-2xl mb-4 font-light animate-fade-in-up delay-200" style={{ color: "var(--platinum)", letterSpacing: "0.05em" }}>
            VOL I. - Soirée à Hawaï
          </p>
          <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto animate-fade-in-up delay-300" style={{ color: "var(--platinum)", opacity: 0.9 }}>
            14 Février 2026 • 22h - 6h30 • Tenue d&apos;été élégante
          </p>
          <Link
            href="/reservation"
            className="inline-block px-8 py-4 bg-transparent text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-[var(--neon-purple)]/50 transition-all duration-300 transform hover:scale-105 elegant-border animate-scale-in delay-400"
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
