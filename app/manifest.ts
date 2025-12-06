import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Genesis - Événements Exclusifs",
        short_name: "Genesis",
        description: "Réservez votre pass pour des événements d'exception et de prestige",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#D4AF37",
        orientation: "portrait",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    }
}
