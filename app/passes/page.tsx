import Link from "next/link"
import Image from "next/image"

export default function PassesPage() {
  return (
    <main className="min-h-screen pt-20" style={{ backgroundColor: "var(--navy)" }}>
      {/* Hero with palm trees background */}
      <section className="relative py-20 px-4 overflow-hidden">
        <Image
          src="/dark-night-sky-with-palm-tree-silhouettes.jpg"
          alt="Palm trees background"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)] via-transparent to-[var(--navy)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold text-center mb-6 gold-text"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Choisis ton pass
          </h1>
          <p className="text-center mb-16 text-lg max-w-3xl mx-auto" style={{ color: "var(--platinum)" }}>
            Chaque pass inclut votre accès garanti à l&apos;événement + votre badge exclusif Genesis à l&apos;entrée.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* ONE MAN */}
            <Link href="/passes/one-man" className="group">
              <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-[var(--platinum)]/40 bg-gradient-to-b from-[var(--deep-blue)]/90 to-[var(--navy)]/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[var(--champagne-gold)]/30">
                <div className="p-8 text-center">
                  <h3 
                    className="text-4xl font-bold mb-2 gold-text"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    ONE MAN
                  </h3>
                  <p className="text-3xl font-bold mb-6" style={{ color: "var(--champagne-gold)" }}>
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

                  <button className="w-full py-4 px-8 bg-gradient-to-r from-[var(--deep-blue)] to-[var(--accent-blue)] text-lg font-semibold rounded-full hover:shadow-xl hover:shadow-[var(--champagne-gold)]/20 transition-all duration-300" style={{ color: "var(--platinum)" }}>
                    Sélectionner ce pass
                  </button>
                </div>
              </div>
            </Link>

            {/* ONE LADY */}
            <Link href="/passes/one-lady" className="group">
              <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-[var(--platinum)]/40 bg-gradient-to-b from-[var(--deep-blue)]/90 to-[var(--navy)]/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[var(--champagne-gold)]/30">
                <div className="p-8 text-center">
                  <h3 
                    className="text-4xl font-bold mb-2 gold-text"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    ONE LADY
                  </h3>
                  <p className="text-3xl font-bold mb-6" style={{ color: "var(--champagne-gold)" }}>
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

                  <button className="w-full py-4 px-8 bg-gradient-to-r from-[var(--deep-blue)] to-[var(--accent-blue)] text-lg font-semibold rounded-full hover:shadow-xl hover:shadow-[var(--champagne-gold)]/20 transition-all duration-300" style={{ color: "var(--platinum)" }}>
                    Sélectionner ce pass
                  </button>
                </div>
              </div>
            </Link>

            {/* FIVE QUEENS */}
            <Link href="/passes/five-queens" className="group">
              <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-[var(--platinum)]/40 bg-gradient-to-b from-[var(--deep-blue)]/90 to-[var(--navy)]/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[var(--champagne-gold)]/30">
                <div className="p-8 text-center">
                  <h3 
                    className="text-4xl font-bold mb-2 gold-text"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    FIVE QUEENS
                  </h3>
                  <p className="text-3xl font-bold mb-6" style={{ color: "var(--champagne-gold)" }}>
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

                  <button className="w-full py-4 px-8 bg-gradient-to-r from-[var(--deep-blue)] to-[var(--accent-blue)] text-lg font-semibold rounded-full hover:shadow-xl hover:shadow-[var(--champagne-gold)]/20 transition-all duration-300" style={{ color: "var(--platinum)" }}>
                    Sélectionner ce pass
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--platinum)]/20 py-12 mt-20" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">
            <span className="gold-text" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Genesis
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--platinum)", opacity: 0.6 }}>© 2025 Genesis. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  )
}
