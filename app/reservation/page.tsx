import Image from "next/image"
import { Flame } from "lucide-react"

export default function ReservationPage() {
  return (
    <main className="min-h-screen bg-black pt-20">
      {/* Hero Section with Pool Party Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/luxury-pool-party-neon-lights-no-text.jpg"
          alt="Demon Time Pool Party"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="neon-border rounded-3xl p-12 bg-black/70 backdrop-blur-md">
            <h1
              className="text-4xl md:text-6xl font-bold mb-8 neon-text"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Bienvenue dans l&apos;antre du Demon.
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
              Prêt·e à entrer dans la soirée la plus chaude de l&apos;année ? Réserve ton pass, reçois ton QR unique, et
              prépare-toi à vivre chaque instant de session de Novembre 2025. Les places sont limitées. Pas de QR, pas
              d&apos;entrée. Simple.
            </p>
            <button className="px-10 py-4 bg-gradient-to-r from-[var(--neon-red)] to-[var(--neon-pink)] text-white text-xl font-semibold rounded-full hover:shadow-2xl hover:shadow-[var(--neon-red)]/50 transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Je réserve maintenant
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-[var(--neon-red)]/30 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">
            <span className="gold-text" style={{ fontFamily: "var(--font-cinzel), serif" }}>
              DEMON
            </span>
            <span className="text-white" style={{ fontFamily: "var(--font-cinzel), serif" }}>
              {" "}
              TIME
            </span>
          </div>
          <p className="text-white/60 text-sm">© 2025 Demon Time. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  )
}
