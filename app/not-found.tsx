import Link from "next/link"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <main
            className="min-h-screen pt-24 flex items-center justify-center px-4"
            style={{ backgroundColor: "var(--space-dark)" }}
        >
            <div className="max-w-md w-full text-center">
                {/* 404 Visual */}
                <div className="mb-8">
                    <h1
                        className="text-8xl md:text-9xl font-bold gold-text"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        404
                    </h1>
                </div>

                {/* Message */}
                <h2
                    className="text-2xl md:text-3xl font-bold mb-4"
                    style={{
                        fontFamily: "var(--font-playfair), serif",
                        color: "var(--platinum)"
                    }}
                >
                    Page introuvable
                </h2>

                <p
                    className="text-lg mb-8"
                    style={{ color: "var(--platinum)", opacity: 0.7 }}
                >
                    La page que vous recherchez n&apos;existe pas ou a été déplacée.
                </p>

                {/* Search Icon Animation */}
                <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-8 animate-pulse"
                    style={{
                        backgroundColor: "rgba(192, 132, 252, 0.2)",
                        border: "3px solid var(--neon-purple)"
                    }}
                >
                    <Search className="w-8 h-8" style={{ color: "var(--neon-purple)" }} />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--cosmic-blue)] to-[var(--deep-purple)] rounded-full font-semibold hover:shadow-lg hover:shadow-[var(--neon-purple)]/30 transition-all"
                        style={{ color: "var(--platinum)" }}
                    >
                        <Home className="w-5 h-5" />
                        Retour à l&apos;accueil
                    </Link>

                    <Link
                        href="/reservation"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all elegant-border"
                        style={{ color: "var(--platinum)" }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Voir les passes
                    </Link>
                </div>

                {/* Decorative elements */}
                <div className="mt-12 flex justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{
                                backgroundColor: "var(--neon-purple)",
                                animationDelay: `${i * 0.2}s`,
                                opacity: 0.6 - i * 0.1
                            }}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}
