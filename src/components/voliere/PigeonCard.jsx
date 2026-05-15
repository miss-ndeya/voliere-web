import { Bird } from 'lucide-react'

/**
 * Carte d'affichage d'un pigeon dans le sidebar
 */
export function PigeonCard({ pigeon }) {

    return (
        <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${pigeon.sexe === "male" ? "bg-primary-foreground text-primary" : "bg-cage-single-soft text-cage-single"}`}>
                <Bird className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
                <div className={`font-medium ${pigeon.sexe === "male" ? "text-primary" : ""}`}>
                    {pigeon.sexe === "male" ? "Mâle" : "Femelle"}
                </div>
                <div className="text-xs text-muted-foreground">
                    Bague : {pigeon.bague} · {pigeon.race}
                </div>
                <div className="text-xs text-muted-foreground">
                    Né le {new Date(pigeon?.date_naissance).toLocaleDateString("fr-FR")}
                </div>
            </div>
        </div>
    )
}