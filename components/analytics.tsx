"use client"

import { Analytics as VercelAnalytics } from "@vercel/analytics/react"
import { useEffect } from "react"
import { getFirebaseAnalytics } from "@/lib/firebase"

export function Analytics() {
    useEffect(() => {
        // Initialize Firebase Analytics
        const initAnalytics = async () => {
            await getFirebaseAnalytics()
        }
        initAnalytics()
    }, [])

    return <VercelAnalytics />
}
