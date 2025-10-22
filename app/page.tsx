import Link from "next/link"
import Image from "next/image"
import { Flame } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-end overflow-hidden pb-20">
        <Image src="/hero-black-women-pool-2.jpg" alt="Demon Time Pool Party" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 gold-text drop-shadow-2xl"
            style={{
              fontFamily: "var(--font-cinzel), serif",
              textShadow: "0 0 30px rgba(255, 100, 0, 0.8), 0 0 60px rgba(255, 50, 0, 0.6)",
            }}
          >
            Bienvenue dans l&apos;antre du Demon.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Prêt·e à entrer dans la soirée la plus chaude de l&apos;année ? Réserve ton pass, reçois ton QR unique, et
            prépare-toi à vivre chaque instant de session de Novembre 2025. Les places sont limitées. Pas de QR, pas
            d&apos;entrée. Simple.
          </p>
          <Link
            href="/reservation"
            className="inline-block px-8 py-4 bg-transparent text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-[var(--neon-red)]/50 transition-all duration-300 transform hover:scale-105 border-2 border-[var(--neon-red)]"
          >
            <span className="flex items-center gap-2">
              <Flame className="w-5 h-5" />
              Je réserve maintenant
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}
