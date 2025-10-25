import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "600", "700"], variable: "--font-cormorant" })

export const metadata: Metadata = {
  title: "Genesis - Événements Exclusifs",
  description: "Réservez votre pass pour des événements d'exception et de prestige",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans antialiased ${playfair.variable} ${cormorant.variable}`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
