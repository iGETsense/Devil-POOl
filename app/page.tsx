import Link from "next/link"
import Image from "next/image"
import { Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--space-dark)" }}>
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
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
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
            <div className="glass-panel px-10 py-6 rounded-[2rem] mb-8 animate-reveal">
              <h1 className="heading-xl text-6xl md:text-8xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-platinum to-stardust">
                GENESIS VOL.I
              </h1>
            </div>

            <p className="text-2xl md:text-3xl mb-8 font-light italic tracking-widest text-gold animate-reveal delay-200">
              Hawaiian Summer Party
            </p>

            <div className="max-w-2xl mx-auto space-y-6 mb-12">
              <p className="text-lg md:text-xl text-platinum/90 leading-relaxed animate-reveal delay-300">
                Prépare-toi à vivre la soirée de l&apos;année ! Plonge dans une ambiance luxueuse et festive, où chaque lumière, chaque cocktail et chaque beat t&apos;embarque pour un voyage inoubliable.
              </p>
              <p className="text-lg md:text-xl text-platinum/80 leading-relaxed animate-reveal delay-400">
                Luxe tropical, ose les couleurs et ton style unique pour danser jusqu&apos;au bout de la nuit sous le soleil hawaïen.
              </p>
            </div>

            <div className="animate-reveal delay-500">
              <p className="text-xl md:text-2xl mb-8 font-semibold text-holographic drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]">
                Prêt(e) pour la soirée de tes rêves ?
              </p>

              <Link
                href="/reservation"
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-royal-purple text-white text-lg font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>Je réserve maintenant</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
