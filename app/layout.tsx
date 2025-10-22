import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Cinzel, UnifrakturCook } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" })
const unifraktur = UnifrakturCook({ subsets: ["latin"], weight: "700", variable: "--font-gothic" })

export const metadata: Metadata = {
  title: "Demon Time - Soirées Exclusives",
  description: "Réservez votre pass pour les soirées les plus chaudes de l'année",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans antialiased ${cinzel.variable} ${unifraktur.variable}`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
