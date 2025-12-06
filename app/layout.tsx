import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "600", "700"], variable: "--font-cormorant" })

export const metadata: Metadata = {
  title: {
    default: "Genesis - Événements Exclusifs",
    template: "%s | Genesis",
  },
  description: "Réservez votre pass pour des événements d'exception et de prestige. Découvrez nos soirées exclusives et expériences uniques.",
  generator: "v0.app",
  applicationName: "Genesis",
  keywords: ["événements", "exclusifs", "soirées", "prestige", "réservation", "pass", "Genesis", "événements VIP", "expériences uniques"],
  authors: [{ name: "Genesis Events" }],
  creator: "Genesis",
  publisher: "Genesis",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://genesis-events.com"),
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/",
    },
  },
  openGraph: {
    title: "Genesis - Événements Exclusifs",
    description: "Réservez votre pass pour des événements d'exception et de prestige",
    url: "https://genesis-events.com",
    siteName: "Genesis",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Genesis - Événements Exclusifs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Genesis - Événements Exclusifs",
    description: "Réservez votre pass pour des événements d'exception et de prestige",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "T9gNRa6AunqtE10YM_eXms2E8edTX7KAe-jAoRORYbc",
  },
  category: "events",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans antialiased ${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
