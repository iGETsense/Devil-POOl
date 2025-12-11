import Link from "next/link"
import Image from "next/image"

export default function PassesPage() {
    return (
        <main className="min-h-screen pt-24 bg-[#050010] font-sans relative overflow-hidden flex flex-col items-center">
            {/* Background - Exact Geometric Dark Purple */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[#050010]" />

                {/* Subtle Geometric Texture Pattern */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, #2e1065 0%, transparent 60%)`,
                    }}
                />

                {/* Geometric Polygons (CSS only approximation of the reference) */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="poly" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                <path d="M0 0L50 50L0 100" stroke="white" strokeWidth="0.5" fill="none" />
                                <path d="M100 0L50 50L100 100" stroke="white" strokeWidth="0.5" fill="none" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#poly)" />
                    </svg>
                </div>

                {/* Major Neon Beams */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                {/* Laser Lines matching reference layout */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] right-[-10%] w-[120%] h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent -rotate-12 blur-[1px] opacity-70" />
                    <div className="absolute bottom-[20%] left-[-10%] w-[120%] h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent -rotate-12 blur-[1px] opacity-70" />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
                {/* Title */}
                <h1 className="text-5xl md:text-7xl text-white mb-20 tracking-wider drop-shadow-lg" style={{ fontFamily: "var(--font-playfair), serif" }}>
                    Choisis ton pass
                </h1>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 justify-items-center">

                    {/* ONE MAN */}
                    <Link href="/passes/one-man" className="group">
                        <div className="relative w-80 h-[550px] rounded-[2.5rem] p-5 flex flex-col items-center bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                            {/* Card Neon Glow Border */}
                            <div className="absolute inset-0 rounded-[2.5rem] border border-purple-500/30 group-hover:border-purple-500/80 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-500" />

                            {/* Image */}
                            <div className="relative w-full h-[60%] rounded-[1.5rem] overflow-hidden mb-6 z-10 shadow-2xl">
                                <Image
                                    src="/one-man-neon.png"
                                    alt="One Man"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 text-center w-full mt-2">
                                <h2 className="text-2xl text-white mb-3 tracking-[0.2em] font-light" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    ONE MAN
                                </h2>
                                <p className="text-4xl font-bold text-fuchsia-500 mb-8 drop-shadow-md tracking-tight">
                                    15,000 FCFA
                                </p>
                                <div className="w-full py-4 rounded-full bg-black/40 border border-white/20 text-white text-sm font-medium tracking-[0.15em] uppercase transition-all group-hover:bg-purple-600/20 group-hover:border-purple-400">
                                    SÉLECTIONNER CE PASS
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* ONE LADY */}
                    <Link href="/passes/one-lady" className="group">
                        <div className="relative w-80 h-[550px] rounded-[2.5rem] p-5 flex flex-col items-center bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                            {/* Card Neon Glow Border */}
                            <div className="absolute inset-0 rounded-[2.5rem] border border-purple-500/30 group-hover:border-purple-500/80 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-500" />

                            {/* Image */}
                            <div className="relative w-full h-[60%] rounded-[1.5rem] overflow-hidden mb-6 z-10 shadow-2xl">
                                <Image
                                    src="/one-lady-neon.png"
                                    alt="One Lady"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 text-center w-full mt-2">
                                <h2 className="text-2xl text-white mb-3 tracking-[0.2em] font-light" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    ONE LADY
                                </h2>
                                <p className="text-4xl font-bold text-fuchsia-500 mb-8 drop-shadow-md tracking-tight">
                                    10,000 FCFA
                                </p>
                                <div className="w-full py-4 rounded-full bg-black/40 border border-white/20 text-white text-sm font-medium tracking-[0.15em] uppercase transition-all group-hover:bg-purple-600/20 group-hover:border-purple-400">
                                    SÉLECTIONNER CE PASS
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* FIVE QUEENS */}
                    <Link href="/passes/five-queens" className="group">
                        <div className="relative w-80 h-[550px] rounded-[2.5rem] p-5 flex flex-col items-center bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                            {/* Card Neon Glow Border */}
                            <div className="absolute inset-0 rounded-[2.5rem] border border-purple-500/30 group-hover:border-purple-500/80 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-500" />

                            {/* Image */}
                            <div className="relative w-full h-[60%] rounded-[1.5rem] overflow-hidden mb-6 z-10 shadow-2xl">
                                <Image
                                    src="/five-queens-neon.png"
                                    alt="Five Queens"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 text-center w-full mt-2">
                                <h2 className="text-2xl text-white mb-3 tracking-[0.2em] font-light" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    FIVE QUEENS
                                </h2>
                                <p className="text-4xl font-bold text-fuchsia-500 mb-8 drop-shadow-md tracking-tight">
                                    5,000 FCFA
                                </p>
                                <div className="w-full py-4 rounded-full bg-black/40 border border-white/20 text-white text-sm font-medium tracking-[0.15em] uppercase transition-all group-hover:bg-purple-600/20 group-hover:border-purple-400">
                                    SÉLECTIONNER CE PASS
                                </div>
                            </div>
                        </div>
                    </Link>

                </div>
            </div>
        </main>
    )
}
