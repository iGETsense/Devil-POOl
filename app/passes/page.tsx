import Link from "next/link"
import Image from "next/image"

export default function PassesPage() {
  return (
    <main className="min-h-screen pt-20" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Hero with palm trees background */}
      <section className="relative py-20 px-4 overflow-hidden">
        <Image
          src="/dark-night-sky-with-palm-tree-silhouettes.jpg"
          alt="Palm trees background"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold text-center mb-6 gold-text"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            Choisis ton pass
          </h1>
          <p className="text-center text-white/90 mb-16 text-lg max-w-3xl mx-auto">
            Chaque pass inclut ton accès garanti à la soirée + ton estampille officiale DT à l&apos;entrée.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* ONE MAN */}
            <Link href="/passes/one-man" className="group">
              <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-[#ff3366] bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff3366]/50">
                <div className="p-8 text-center">
                  <h3 
                    className="text-4xl font-bold mb-2 gold-text"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                  >
                    ONE MAN
                  </h3>
                  <p className="text-3xl font-bold mb-6" style={{ color: "#ff3366" }}>
                    15 000 FCFA
                  </p>
                  
                  <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8">
                    <Image
                      src="/one-man-card.jpg"
                      alt="One Man Pass"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <button className="w-full py-4 px-8 bg-gradient-to-r from-red-900 to-red-700 text-white text-lg font-semibold rounded-full hover:from-red-800 hover:to-red-600 transition-all duration-300 shadow-lg">
                    Sélectionner ce pass
                  </button>
                </div>
              </div>
            </Link>

            {/* ONE LADY */}
            <Link href="/passes/one-lady" className="group">
              <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-[#ff3366] bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff3366]/50">
                <div className="p-8 text-center">
                  <h3 
                    className="text-4xl font-bold mb-2 gold-text"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                  >
                    ONE LADY
                  </h3>
                  <p className="text-3xl font-bold mb-6" style={{ color: "#ff3366" }}>
                    10 000 FCFA
                  </p>
                  
                  <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8">
                    <Image
                      src="/one-lady-card.jpg"
                      alt="One Lady Pass"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <button className="w-full py-4 px-8 bg-gradient-to-r from-red-900 to-red-700 text-white text-lg font-semibold rounded-full hover:from-red-800 hover:to-red-600 transition-all duration-300 shadow-lg">
                    Sélectionner ce pass
                  </button>
                </div>
              </div>
            </Link>

            {/* FIVE QUEENS */}
            <Link href="/passes/five-queens" className="group">
              <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-[#ff3366] bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff3366]/50">
                <div className="p-8 text-center">
                  <h3 
                    className="text-4xl font-bold mb-2 gold-text"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                  >
                    FIVE QUEENS
                  </h3>
                  <p className="text-3xl font-bold mb-6" style={{ color: "#ff3366" }}>
                    5 000 FCFA
                  </p>
                  
                  <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8">
                    <Image
                      src="/five-queens-card.jpg"
                      alt="Five Queens Pass"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <button className="w-full py-4 px-8 bg-gradient-to-r from-red-900 to-red-700 text-white text-lg font-semibold rounded-full hover:from-red-800 hover:to-red-600 transition-all duration-300 shadow-lg">
                    Sélectionner ce pass
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ff3366]/30 py-12 mt-20" style={{ backgroundColor: "#0a0a0a" }}>
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
