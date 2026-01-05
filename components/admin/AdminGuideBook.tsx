"use client"

import { useState } from "react"
import { Book, ChevronDown, ChevronRight, AlertCircle, CheckCircle, Clock, XCircle, CreditCard, Smartphone, HelpCircle } from "lucide-react"

interface Section {
    id: string
    title: string
    icon: React.ReactNode
    content: React.ReactNode
}

export default function AdminGuideBook() {
    const [openSection, setOpenSection] = useState<string | null>("booking-process")

    const sections: Section[] = [
        {
            id: "booking-process",
            title: "Processus de Réservation",
            icon: <CreditCard className="w-5 h-5" />,
            content: (
                <div className="space-y-4 text-gray-300">
                    <h4 className="text-white font-semibold">Flux Complet</h4>
                    <ol className="list-decimal list-inside space-y-2 pl-2">
                        <li>L'utilisateur sélectionne un pass (ONE MAN, ONE LADY, FIVE QUEENS)</li>
                        <li>Il remplit le formulaire avec ses informations</li>
                        <li>Il choisit son opérateur (Orange Money ou MTN MoMo)</li>
                        <li>Il clique sur "Confirmer" → <span className="text-yellow-400">Paiement initié via MeSomb</span></li>
                        <li>L'utilisateur reçoit une notification sur son téléphone pour confirmer le paiement</li>
                        <li>Après confirmation → Le statut passe à <span className="text-green-400">"Payé"</span></li>
                        <li>L'utilisateur est redirigé vers la page de confirmation avec son QR code</li>
                    </ol>
                </div>
            )
        },
        {
            id: "statuses",
            title: "Signification des Statuts",
            icon: <Clock className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                            <h4 className="text-yellow-400 font-semibold">Pending (En Attente)</h4>
                            <p className="text-gray-400 text-sm">La réservation a été créée mais le paiement n'a pas encore été confirmé. Cela peut être dû à un délai de traitement ou à un paiement non finalisé par l'utilisateur.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                        <CreditCard className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                            <h4 className="text-blue-400 font-semibold">Paid (Payé)</h4>
                            <p className="text-gray-400 text-sm">Le paiement a été confirmé par MeSomb. Le billet est valide et peut être scanné à l'entrée.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                            <h4 className="text-green-400 font-semibold">Validated (Validé)</h4>
                            <p className="text-gray-400 text-sm">Le billet a été scanné et l'entrée a été accordée. Ce statut indique que le client est entré dans l'événement.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                        <div>
                            <h4 className="text-red-400 font-semibold">Cancelled (Annulé)</h4>
                            <p className="text-gray-400 text-sm">La réservation a été annulée manuellement ou suite à un échec de paiement définitif.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "errors",
            title: "Gestion des Erreurs",
            icon: <AlertCircle className="w-5 h-5" />,
            content: (
                <div className="space-y-4 text-gray-300">
                    <h4 className="text-white font-semibold">Erreurs Communes et Solutions</h4>

                    <div className="border-l-4 border-red-500 pl-4 py-2">
                        <p className="font-medium text-red-400">"Paiement refusé"</p>
                        <ul className="text-sm space-y-1 mt-2">
                            <li>• Vérifiez que le client a un solde suffisant</li>
                            <li>• Vérifiez que le numéro est correct et correspond à l'opérateur choisi</li>
                            <li>• Demandez au client de vérifier ses notifications SMS</li>
                        </ul>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4 py-2">
                        <p className="font-medium text-yellow-400">"Réservation bloquée en Pending"</p>
                        <ul className="text-sm space-y-1 mt-2">
                            <li>• Le client n'a peut-être pas confirmé le paiement sur son téléphone</li>
                            <li>• Vérifiez le tableau de bord MeSomb pour le statut réel</li>
                            <li>• Si le paiement est confirmé dans MeSomb mais pas ici, contactez le support</li>
                        </ul>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4 py-2">
                        <p className="font-medium text-orange-400">"Code QR invalide"</p>
                        <ul className="text-sm space-y-1 mt-2">
                            <li>• Le QR code peut être mal formé ou corrompu</li>
                            <li>• Essayez de saisir manuellement l'ID de réservation (ex: GEN-XXXXX)</li>
                            <li>• Vérifiez dans la liste des invités si le nom est présent</li>
                        </ul>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                        <p className="font-medium text-purple-400">"Billet déjà utilisé"</p>
                        <ul className="text-sm space-y-1 mt-2">
                            <li>• Ce billet a déjà été scanné le nombre maximum de fois</li>
                            <li>• Pour FIVE QUEENS: 5 entrées maximum (1 par personne)</li>
                            <li>• Pour ONE MAN/ONE LADY: 1 entrée maximum</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "troubleshooting",
            title: "Dépannage",
            icon: <HelpCircle className="w-5 h-5" />,
            content: (
                <div className="space-y-4 text-gray-300">
                    <h4 className="text-white font-semibold">Étapes de Dépannage</h4>

                    <div className="space-y-3">
                        <div className="p-3 bg-white/5 rounded-xl">
                            <p className="font-medium text-white">1. Rafraîchir les données</p>
                            <p className="text-sm text-gray-400">Cliquez sur le bouton de rafraîchissement en haut du tableau de bord pour recharger les statistiques et la liste des invités.</p>
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl">
                            <p className="font-medium text-white">2. Vérifier le réseau</p>
                            <p className="text-sm text-gray-400">Assurez-vous que votre appareil est connecté à Internet. Les opérations de scan et de paiement nécessitent une connexion stable.</p>
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl">
                            <p className="font-medium text-white">3. Utiliser la recherche</p>
                            <p className="text-sm text-gray-400">Utilisez la barre de recherche pour trouver rapidement un invité par nom ou ID de réservation.</p>
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl">
                            <p className="font-medium text-white">4. Contacter le support</p>
                            <p className="text-sm text-gray-400">Si le problème persiste, contactez l'équipe technique avec les détails de l'erreur et l'ID de la réservation concernée.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "mesomb",
            title: "Comprendre MeSomb",
            icon: <Smartphone className="w-5 h-5" />,
            content: (
                <div className="space-y-4 text-gray-300">
                    <p>MeSomb est la passerelle de paiement mobile utilisée pour traiter les transactions Orange Money et MTN Mobile Money.</p>

                    <h4 className="text-white font-semibold mt-4">Flux de Paiement MeSomb</h4>
                    <ol className="list-decimal list-inside space-y-2 pl-2">
                        <li>Nous envoyons une demande de paiement à MeSomb avec le montant et le numéro</li>
                        <li>MeSomb envoie une notification USSD au téléphone du client</li>
                        <li>Le client confirme avec son code secret</li>
                        <li>MeSomb nous notifie du succès/échec</li>
                        <li>Nous mettons à jour le statut de la réservation</li>
                    </ol>

                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                        <p className="text-sm text-blue-300">
                            <strong>Note:</strong> Les revenus affichés dans le dashboard (Total, Orange, MTN) reflètent uniquement les paiements confirmés par MeSomb.
                        </p>
                    </div>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30">
                    <Book className="w-6 h-6 text-fuchsia-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Guide Administrateur</h2>
                    <p className="text-gray-400 text-sm">Tout ce que vous devez savoir pour gérer l'événement</p>
                </div>
            </div>

            <div className="space-y-3">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className="bg-[#1a0a2e]/60 border border-white/10 rounded-2xl overflow-hidden"
                    >
                        <button
                            onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-purple-400">{section.icon}</div>
                                <span className="font-medium text-white">{section.title}</span>
                            </div>
                            {openSection === section.id ? (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                        </button>

                        {openSection === section.id && (
                            <div className="px-4 pb-4 border-t border-white/5 pt-4">
                                {section.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
