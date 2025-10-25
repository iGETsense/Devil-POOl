import Link from "next/link"
import Image from "next/image"

export default function PassesPage() {
  return (
    <main className="min-h-screen pt-20" style={{ backgroundColor: "var(--space-dark)" }}>
      {/* Hero with palm trees background */}
      <section className="relative py-20 px-4 overflow-hidden">
        <Image
          src="/dark-night-sky-with-palm-tree-silhouettes.jpg"
          alt="Palm trees background"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--space-dark)] via-transparent to-[var(--space-dark)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold text-center mb-6 gold-text animate-fade-in"
            style={{ 
              fontFamily: "var(--font-playfair), serif",
              letterSpacing: "0.02em",
              textShadow: "0 0 40px rgba(192, 132, 252, 0.4), 0 0 80px rgba(192, 132, 252, 0.2)"
            }}
          >
            Choisis ton pass
          </h1>
          <p className="text-center mb-16 text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: "var(--platinum)", opacity: 0.9 }}>
            Chaque pass inclut votre accès garanti à l&apos;événement + votre badge exclusif Genesis à l&apos;entrée.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* ONE MAN */}
            <Link href="/passes/one-man" className="group">
              <div className="relative rounded-[2.5rem] overflow-hidden elegant-border bg-gradient-to-b from-[var(--cosmic-blue)]/90 to-[var(--space-dark)]/70 backdrop-blur-sm transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-[var(--neon-purple)]/40 hover:border-[var(--neon-purple)]">
                <div className="p-8 text-center">
                  <h3 
                    className="text-4xl font-bold mb-2 gold-text transition-all duration-300 group-hover:scale-105"
                    style={{ fontFamily: "var(--font-playfair), serif", letterSpacing: "0.02em" }}
                  >
                    ONE MAN
                  </h3>
                  <p className="text-3xl font-bold mb-6 transition-all duration-300 group-hover:text-shadow-lg" style={{ color: "var(--neon-purple)", textShadow: "0 0 20px rgba(192, 132, 252, 0.3)" }}>
                    15 000 FCFA
                  </p>
                  
                  <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8 group-hover:shadow-xl transition-all duration-500">
                    <Image
                      src="/one-man-card.jpg"
                      alt="One Man Pass"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Subtle purple glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--space-dark)]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Purple border glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: "inset 0 0 40px rgba(192, 132, 252, 0.3)" }} />
                  </div>

                  <button className="w-full py-4 px-8 bg-gradient-to-r from-[var(--cosmic-blue)] to-[var(--deep-purple)] text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-[var(--neon-purple)]/50 transition-all duration-500 hover:scale-[1.02] active:scale-95 relative overflow-hidden group/btn" style={{ color: "var(--platinum)" }}>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>Sélectionner ce pass</span>
                      <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-purple)]/0 to-[var(--neon-purple)]/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                  </button>
                </div>
              </div>
            </Link>

            {/* ONE LADY */}
            <Link href="/passes/one-lady" className="group">
              <div className="relative rounded-[2.5rem] overflow-hidden elegant-border bg-gradient-to-b from-[var(--cosmic-blue)]/90 to-[var(--space-dark)]/70 backdrop-blur-sm transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-[var(--neon-purple)]/40 hover:border-[var(--neon-purple)]">
                <div className="p-8 text-center">
                  <h3 
                    className="text-4xl font-bold mb-2 gold-text transition-all duration-300 group-hover:scale-105"
                    style={{ fontFamily: "var(--font-playfair), serif", letterSpacing: "0.02em" }}
                  >
                    ONE LADY
                  </h3>
                  <p className="text-3xl font-bold mb-6 transition-all duration-300 group-hover:text-shadow-lg" style={{ color: "var(--neon-purple)", textShadow: "0 0 20px rgba(192, 132, 252, 0.3)" }}>
                    10 000 FCFA
                  </p>
                  
                  <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8 group-hover:shadow-xl transition-all duration-500">
                    <Image
                      src="/one-lady-card.jpg"
                      alt="One Lady Pass"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Subtle purple glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--space-dark)]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Purple border glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: "inset 0 0 40px rgba(192, 132, 252, 0.3)" }} />
                  </div>

                  <button className="w-full py-4 px-8 bg-gradient-to-r from-[var(--cosmic-blue)] to-[var(--deep-purple)] text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-[var(--neon-purple)]/50 transition-all duration-500 hover:scale-[1.02] active:scale-95 relative overflow-hidden group/btn" style={{ color: "var(--platinum)" }}>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>Sélectionner ce pass</span>
                      <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-purple)]/0 to-[var(--neon-purple)]/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                  </button>
                </div>
              </div>
            </Link>

            {/* FIVE QUEENS */}
            <Link href="/passes/five-queens" className="group">
              <div className="relative rounded-[2.5rem] overflow-hidden elegant-border bg-gradient-to-b from-[var(--cosmic-blue)]/90 to-[var(--space-dark)]/70 backdrop-blur-sm transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-[var(--neon-purple)]/40 hover:border-[var(--neon-purple)]">
                <div className="p-8 text-center">
                  <h3 
                    className="text-4xl font-bold mb-2 gold-text transition-all duration-300 group-hover:scale-105"
                    style={{ fontFamily: "var(--font-playfair), serif", letterSpacing: "0.02em" }}
                  >
                    FIVE QUEENS
                  </h3>
                  <p className="text-3xl font-bold mb-6 transition-all duration-300 group-hover:text-shadow-lg" style={{ color: "var(--neon-purple)", textShadow: "0 0 20px rgba(192, 132, 252, 0.3)" }}>
                    5 000 FCFA
                  </p>
                  
                  <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8 group-hover:shadow-xl transition-all duration-500">
                    <Image
                      src="/five-queens-card.jpg"
                      alt="Five Queens Pass"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Subtle purple glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--space-dark)]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Purple border glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: "inset 0 0 40px rgba(192, 132, 252, 0.3)" }} />
                  </div>

                  <button className="w-full py-4 px-8 bg-gradient-to-r from-[var(--cosmic-blue)] to-[var(--deep-purple)] text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-[var(--neon-purple)]/50 transition-all duration-500 hover:scale-[1.02] active:scale-95 relative overflow-hidden group/btn" style={{ color: "var(--platinum)" }}>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>Sélectionner ce pass</span>
                      <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-purple)]/0 to-[var(--neon-purple)]/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--platinum)]/20 py-12 mt-20" style={{ backgroundColor: "var(--space-dark)" }}>
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
