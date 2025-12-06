import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Analytics } from "@/components/analytics"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://genesis-events.com"),
  title: {
    default: "Genesis - Événements Exclusifs",
    template: "%s | Genesis Events"
  },
  description: "Réservez votre pass pour la soirée la plus exclusive de l'année. Luxe, ambiance et prestige.",
  applicationName: "Genesis Events",
  keywords: ["soirée", "événement", "luxe", "pool party", "étudiant", "genesis", "cameroun"],
  authors: [{ name: "Genesis Team" }],
  creator: "Genesis Team",
  publisher: "Genesis Events",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/fr",
    },
  },
  openGraph: {
    title: "Genesis - Événements Exclusifs",
    description: "La soirée la plus attendue de l'année.",
    url: "https://genesis-events.com",
    siteName: "Genesis Events",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Make sure this exists
        width: 1200,
        height: 630,
        alt: "Genesis Event Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Genesis - Événements Exclusifs",
    description: "Réservez votre place pour l'événement de l'année.",
    images: ["/twitter-image.jpg"], // Make sure this exists
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-midnight-black text-platinum selection:bg-royal-purple/30`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
