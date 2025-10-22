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
            <div
              className="neon-border rounded-[40px] overflow-hidden flex flex-col"
              style={{ backgroundColor: "rgba(10, 10, 10, 0.85)" }}
            >
              <div className="p-6 pt-8 text-center flex-1 flex flex-col">
                <h2
                  className="text-3xl md:text-4xl font-bold gold-text mb-2"
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                  ONE MAN
                </h2>
                <p className="text-2xl md:text-3xl neon-text font-bold mb-6">15 000 FCFA</p>
                <div className="relative flex-1 rounded-2xl overflow-hidden mb-6 min-h-[400px]">
                  <Image
                    src="/stylish-man-in-leather-jacket-with-red-and-blue-dr.jpg"
                    alt="One Man Pass"
                    fill
                    className="object-cover"
                  />
                </div>
                <Link
                  href="/reservation?pass=one-man"
                  className="block w-full py-4 px-6 text-white text-base md:text-lg rounded-full font-medium hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#5a1a1a" }}
                >
                  Sélectionner ce pass
                </Link>
              </div>
            </div>

            {/* ONE LADY */}
            <div
              className="neon-border rounded-[40px] overflow-hidden flex flex-col"
              style={{ backgroundColor: "rgba(10, 10, 10, 0.85)" }}
            >
              <div className="p-6 pt-8 text-center flex-1 flex flex-col">
                <h2
                  className="text-3xl md:text-4xl font-bold gold-text mb-2"
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                  ONE LADY
                </h2>
                <p className="text-2xl md:text-3xl neon-text font-bold mb-6">10 000 FCFA</p>
                <div className="relative flex-1 rounded-2xl overflow-hidden mb-6 min-h-[400px]">
                  <Image
                    src="/elegant-woman-in-black-outfit-by-pool-at-night-wit.jpg"
                    alt="One Lady Pass"
                    fill
                    className="object-cover"
                  />
                </div>
                <Link
                  href="/reservation?pass=one-lady"
                  className="block w-full py-4 px-6 text-white text-base md:text-lg rounded-full font-medium hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#5a1a1a" }}
                >
                  Sélectionner ce pass
                </Link>
              </div>
            </div>

            {/* FIVE QUEENS */}
            <div
              className="neon-border rounded-[40px] overflow-hidden flex flex-col"
              style={{ backgroundColor: "rgba(10, 10, 10, 0.85)" }}
            >
              <div className="p-6 pt-8 text-center flex-1 flex flex-col">
                <h2
                  className="text-3xl md:text-4xl font-bold gold-text mb-2"
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                  FIVE QUEENS
                </h2>
                <p className="text-2xl md:text-3xl neon-text font-bold mb-6">5 000 FCFA</p>
                <div className="relative flex-1 rounded-2xl overflow-hidden mb-6 min-h-[400px]">
                  <Image
                    src="/group-of-five-women-in-elegant-black-and-red-dress.jpg"
                    alt="Five Queens Pass"
                    fill
                    className="object-cover"
                  />
                </div>
                <Link
                  href="/reservation?pass=five-queens"
                  className="block w-full py-4 px-6 text-white text-base md:text-lg rounded-full font-medium hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#5a1a1a" }}
                >
                  Sélectionner ce pass
                </Link>
              </div>
            </div>
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
