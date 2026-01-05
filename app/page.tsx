import Link from "next/link"
import Image from "next/image"
import { Sparkles, Calendar, MapPin, Shirt, Music, Star, Waves, PartyPopper } from "lucide-react"

export default function HomePage() {
    return (
        <main className="min-h-screen bg-space-dark font-sans selection:bg-neon-purple/30">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/pool-party-hero.jpg"
                        alt="Genesis Pool Party"
                        fill
                        className="object-cover"
                        priority
                        style={{
                            filter: "brightness(0.6) contrast(1.2) saturate(1.4)",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-space-dark/30 via-transparent to-space-dark" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-7xl mx-auto w-full flex flex-col items-center pt-32 md:pt-40">

                    {/* Main Title - Outline Neon Style */}
                    <div className="mb-8 animate-reveal">
                        <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold tracking-wider text-transparent stroke-neon"
                            style={{
                                fontFamily: "var(--font-inter), sans-serif",
                                WebkitTextStroke: "2px #a855f7",
                                textShadow: "0 0 30px rgba(168,85,247,0.5)"
                            }}>
                            GENESIS VOL.I
                        </h1>
                    </div>

                    {/* Tagline */}
                    <p className="text-2xl md:text-3xl text-white font-medium tracking-wide mb-16 animate-reveal delay-200 drop-shadow-md">
                        Hawaiian Summer Pool Party • Cameroun
                    </p>

                    {/* CTA Button - Glowing Pill */}
                    <div className="mb-24 animate-reveal delay-300 flex flex-col md:flex-row gap-4 items-center justify-center w-full px-4">
                        <Link
                            href="/passes"
                            className="inline-block px-12 py-4 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#d946ef] text-white text-lg font-bold tracking-wide shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] hover:scale-105 transition-all duration-300 border border-white/20 w-full md:w-auto"
                        >
                            Réserver maintenant
                        </Link>

                        <Link
                            href="/retrieve"
                            className="inline-block px-12 py-4 rounded-full bg-black/40 backdrop-blur-md text-white text-lg font-bold tracking-wide border border-white/20 hover:bg-white/10 hover:border-purple-500/50 hover:scale-105 transition-all duration-300 w-full md:w-auto"
                        >
                            Retrouver mon billet
                        </Link>
                    </div>

                    {/* Bottom Info Cards - Glass Pills */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl animate-reveal delay-500">
                        {/* Date Card */}
                        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[140px] hover:bg-white/5 transition-colors group">
                            <div className="p-3 rounded-lg bg-white/5 mb-3 group-hover:bg-neon-purple/20 transition-colors">
                                <Calendar className="w-6 h-6 text-neon-purple" />
                            </div>
                            <p className="text-platinum text-lg font-medium">27 décembre - 2024</p>
                        </div>

                        {/* Lineup Card */}
                        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[140px] hover:bg-white/5 transition-colors group">
                            <div className="p-3 rounded-lg bg-white/5 mb-3 group-hover:bg-neon-purple/20 transition-colors">
                                <Music className="w-6 h-6 text-neon-purple" />
                            </div>
                            <p className="text-platinum text-lg font-medium">Lineup dévoilé</p>
                        </div>

                        {/* Dress Code Card */}
                        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[140px] hover:bg-white/5 transition-colors group">
                            <div className="p-3 rounded-lg bg-white/5 mb-3 group-hover:bg-neon-purple/20 transition-colors">
                                <MapPin className="w-6 h-6 text-neon-purple" />
                            </div>
                            <p className="text-platinum text-lg font-medium">Hawaiian party</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section - Kept consistent but simplified */}
            <section id="info" className="relative py-24 px-4 overflow-hidden">
                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="glass-panel rounded-2xl p-8 text-center group hover:scale-105 transition-transform duration-300 border-t border-neon-purple/30">
                            <Waves className="w-12 h-12 mx-auto mb-4 text-neon-purple" />
                            <h3 className="text-xl font-bold text-platinum mb-2">Piscine Exclusive</h3>
                        </div>
                        <div className="glass-panel rounded-2xl p-8 text-center group hover:scale-105 transition-transform duration-300 border-t border-neon-purple/30">
                            <Music className="w-12 h-12 mx-auto mb-4 text-neon-purple" />
                            <h3 className="text-xl font-bold text-platinum mb-2">DJs Live</h3>
                        </div>
                        <div className="glass-panel rounded-2xl p-8 text-center group hover:scale-105 transition-transform duration-300 border-t border-neon-purple/30">
                            <Star className="w-12 h-12 mx-auto mb-4 text-neon-purple" />
                            <h3 className="text-xl font-bold text-platinum mb-2">Ambiance VIP</h3>
                        </div>
                        <div className="glass-panel rounded-2xl p-8 text-center group hover:scale-105 transition-transform duration-300 border-t border-neon-purple/30">
                            <PartyPopper className="w-12 h-12 mx-auto mb-4 text-neon-purple" />
                            <h3 className="text-xl font-bold text-platinum mb-2">Célébration</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 bg-black/40 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                        GENESIS
                    </span>
                    <p className="text-stardust/60 text-sm mt-4">
                        © 2024 Genesis. Hawaiian Summer Party.
                    </p>
                    <Link href="/retrieve" className="text-xs text-white/30 hover:text-purple-400 mt-2 inline-block transition-colors">
                        Billet perdu ? Récupérer ici
                    </Link>
                </div>
            </footer>
        </main>
    )
}
