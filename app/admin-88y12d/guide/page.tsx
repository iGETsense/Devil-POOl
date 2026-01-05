"use client"

import AdminGuideBook from "@/components/admin/AdminGuideBook"

export default function AdminGuidePage() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Guide & Aide</h1>
                <p className="text-gray-400 text-sm">Documentation complète pour la gestion de l'événement</p>
            </header>

            <div className="max-w-3xl">
                <AdminGuideBook />
            </div>
        </>
    )
}
