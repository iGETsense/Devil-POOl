import Image from "next/image"
import Link from "next/link"

export default function ReservationPage() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background with palm leaves */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M100,100 Q80,50 60,20 M100,100 Q70,60 50,40 M100,100 Q90,70 80,50" stroke="white" strokeWidth="2" fill="none" opacity="0.3"/>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M100,100 Q120,50 140,20 M100,100 Q130,60 150,40 M100,100 Q110,70 120,50" stroke="white" strokeWidth="2" fill="none" opacity="0.3"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 
              className="text-5xl md:text-6xl font-bold mb-6 gold-text"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Choisis ton pass
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto">
              Chaque pass inclut ton accès garanti à the soirée + ton estampille officiale DT à l&apos;entrée.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* ONE MAN Card */}
            <div className="group">
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

                  <Link href="/passes/one-man">
                    <button className="w-full py-4 px-8 bg-gradient-to-r from-red-900 to-red-700 text-white text-lg font-semibold rounded-full hover:from-red-800 hover:to-red-600 transition-all duration-300 shadow-lg">
                      Sélectionner ce pass
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* ONE LADY Card */}
            <div className="group">
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

                  <Link href="/passes/one-lady">
                    <button className="w-full py-4 px-8 bg-gradient-to-r from-red-900 to-red-700 text-white text-lg font-semibold rounded-full hover:from-red-800 hover:to-red-600 transition-all duration-300 shadow-lg">
                      Sélectionner ce pass
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* FIVE QUEENS Card */}
            <div className="group">
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

                  <Link href="/passes/five-queens">
                    <button className="w-full py-4 px-8 bg-gradient-to-r from-red-900 to-red-700 text-white text-lg font-semibold rounded-full hover:from-red-800 hover:to-red-600 transition-all duration-300 shadow-lg">
                      Sélectionner ce pass
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative star */}
      <div className="absolute bottom-10 right-10 opacity-30">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="white">
          <path d="M30,0 L35,25 L60,30 L35,35 L30,60 L25,35 L0,30 L25,25 Z"/>
        </svg>
      </div>
    </main>
  )
}
