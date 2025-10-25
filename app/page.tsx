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
          <div className="inline-block mb-6 px-8 py-4 rounded-3xl animate-fade-in-up" style={{ backgroundColor: "rgba(10, 10, 26, 0.85)", backdropFilter: "blur(10px)" }}>
            <h1
              className="text-6xl md:text-8xl font-black tracking-wider"
              style={{
                fontFamily: "var(--font-playfair), serif",
                color: "#d8b4fe",
                textShadow: "0 0 40px rgba(216, 180, 254, 0.9), 0 0 80px rgba(216, 180, 254, 0.6), 0 4px 20px rgba(0, 0, 0, 0.8)",
                WebkitTextStroke: "2px rgba(124, 58, 237, 0.8)",
              }}
            >
               GENESIS VOL.I 
            </h1>
          </div>
          <p className="text-2xl md:text-3xl mb-6 font-light animate-fade-in-up delay-200" style={{ color: "var(--platinum)", letterSpacing: "0.05em", fontStyle: "italic" }}>
            Hawaiian Summer Party
          </p>
          <p className="text-base md:text-lg mb-6 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-300" style={{ color: "var(--platinum)", opacity: 0.95 }}>
            Prépare-toi à vivre la soirée de l&apos;année ! Plonge dans une ambiance luxueuse et festive, où chaque lumière, chaque cocktail et chaque beat t&apos;embarque pour un voyage inoubliable sous le soleil hawaïen.
          </p>
          <p className="text-base md:text-lg mb-6 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-400" style={{ color: "var(--platinum)", opacity: 0.95 }}>
            Luxe tropical, ose les couleurs, les textures et ton style unique avec une ambiance et des musiques qui te feront danser jusqu&apos;au bout de la nuit.
          </p>
          <p className="text-xl md:text-2xl mb-8 font-semibold animate-fade-in-up delay-500" style={{ color: "var(--neon-purple)", textShadow: "0 0 20px rgba(192, 132, 252, 0.4)" }}>
             Prêt(e) pour la soirée de tes rêves ?
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
