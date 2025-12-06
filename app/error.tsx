"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error)
    }, [error])

    return (
        <main
            className="min-h-screen flex items-center justify-center px-4"
            style={{ backgroundColor: "var(--space-dark)" }}
        >
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                    style={{
                        backgroundColor: "rgba(239, 68, 68, 0.2)",
                        border: "4px solid #ef4444"
                    }}
                >
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                {/* Error Message */}
                <h1
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{
                        fontFamily: "var(--font-playfair), serif",
                        color: "var(--platinum)"
                    }}
                >
                    Oups ! Une erreur s&apos;est produite
                </h1>

                <p
                    className="text-lg mb-8"
                    style={{ color: "var(--platinum)", opacity: 0.7 }}
                >
                    Nous sommes désolés, quelque chose s&apos;est mal passé.
                    Veuillez réessayer ou retourner à l&apos;accueil.
                </p>

                {/* Error Details (only in development) */}
                {process.env.NODE_ENV === "development" && (
                    <div
                        className="mb-6 p-4 rounded-lg text-left text-sm font-mono overflow-auto"
                        style={{
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#fca5a5"
                        }}
                    >
                        <p className="font-bold mb-2">Détails de l&apos;erreur:</p>
                        <p>{error.message}</p>
                        {error.digest && <p className="mt-2 opacity-60">Digest: {error.digest}</p>}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={reset}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--cosmic-blue)] to-[var(--deep-purple)] rounded-full font-semibold hover:shadow-lg hover:shadow-[var(--neon-purple)]/30 transition-all"
                        style={{ color: "var(--platinum)" }}
                    >
                        <RefreshCw className="w-5 h-5" />
                        Réessayer
                    </Button>

                    <Button
                        onClick={() => window.location.href = "/"}
                        variant="outline"
                        className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all"
                        style={{
                            borderColor: "var(--platinum)",
                            color: "var(--platinum)",
                            opacity: 0.7
                        }}
                    >
                        <Home className="w-5 h-5" />
                        Retour à l&apos;accueil
                    </Button>
                </div>
            </div>
        </main>
    )
}
