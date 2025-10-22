import Link from "next/link"
import Image from "next/image"
import { Flame } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-end overflow-hidden pb-20">
        <Image src="/hero-pool-party.jpg" alt="Demon Time Pool Party" fill className="object-cover" priority />
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

      {/* Passes Preview Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 gold-text"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            Choisis ton pass
          </h2>
          <p className="text-center text-white/80 mb-16 text-lg">
            Chaque pass inclut ton accès garanti à la soirée + ton estampille officiale DT à l&apos;entrée.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* ONE MAN */}
            <Link href="/passes/one-man" className="group">
              <div className="neon-border rounded-3xl overflow-hidden bg-black/50 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                <div className="p-6 text-center">
                  <h3 className="text-3xl font-bold gold-text mb-2">ONE MAN</h3>
                  <p className="text-2xl neon-text font-bold mb-4">15 000 FCFA</p>
                  <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                    <Image
                      src="/stylish-man-in-leather-jacket-with-red-and-blue-dr.jpg"
                      alt="One Man Pass"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-red-900 to-red-700 text-white rounded-full font-semibold hover:from-red-800 hover:to-red-600 transition-all">
                    Sélectionner ce pass
                  </button>
                </div>
              </div>
            </Link>

            {/* ONE LADY */}
            <Link href="/passes/one-lady" className="group">
              <div className="neon-border rounded-3xl overflow-hidden bg-black/50 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                <div className="p-6 text-center">
                  <h3 className="text-3xl font-bold gold-text mb-2">ONE LADY</h3>
                  <p className="text-2xl neon-text font-bold mb-4">10 000 FCFA</p>
                  <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                    <Image
                      src="/elegant-woman-in-black-outfit-by-pool-at-night-wit.jpg"
                      alt="One Lady Pass"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-red-900 to-red-700 text-white rounded-full font-semibold hover:from-red-800 hover:to-red-600 transition-all">
                    Sélectionner ce pass
                  </button>
                </div>
              </div>
            </Link>

            {/* FIVE QUEENS */}
            <Link href="/passes/five-queens" className="group">
              <div className="neon-border rounded-3xl overflow-hidden bg-black/50 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                <div className="p-6 text-center">
                  <h3 className="text-3xl font-bold gold-text mb-2">FIVE QUEENS</h3>
                  <p className="text-2xl neon-text font-bold mb-4">5 000 FCFA</p>
                  <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                    <Image
                      src="/group-of-five-women-in-elegant-black-and-red-dress.jpg"
                      alt="Five Queens Pass"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-red-900 to-red-700 text-white rounded-full font-semibold hover:from-red-800 hover:to-red-600 transition-all">
                    Sélectionner ce pass
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-[var(--neon-red)]/30 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">
            <span className="gold-text" style={{ fontFamily: "var(--font-gothic), serif" }}>
              Demon Time
            </span>
          </div>
          <p className="text-white/60 text-sm">© 2025 Demon Time. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  )
}
