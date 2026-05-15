import { Bird } from 'lucide-react'

/**
 * CageTile - Tuile représentant une cage dans la grille
 */
export function CageTile({ cage, active, onClick }) {
    const getCageStyle = () => {
        switch (cage.statut) {
            case 'libre':
                return 'bg-cage-free/10 ring-cage-free/50 text-cage-free hover:bg-cage-free/20'
            case 'occupe':
                return 'bg-cage-single/10 ring-cage-single/60 text-cage-single hover:bg-cage-single/20'
            case 'couple':
                return 'bg-cage-couple/10 ring-cage-couple/60 text-cage-couple hover:bg-cage-couple/20'
            default:
                return 'bg-muted ring-border text-muted-foreground'
        }
    }

    const getLabel = () => {
        switch (cage.statut) {
            case 'libre':
                return 'Libre'
            case 'occupe':
                return '1 pigeon'
            case 'couple':
                return '2 pigeons'
            default:
                return 'Inconnu'
        }
    }

    const getBirds = () => {
        if (cage.statut === 'libre') return 0
        if (cage.statut === 'occupe') return 1
        if (cage.statut === 'couple') return 2
        return 0
    }

    // Générer le contenu du tooltip
    const getTooltipContent = () => {
        if (cage.statut === 'libre') {
            return `Cage ${cage.numero} - ${cage.nom}\nLibre`
        } else if (cage.statut === 'occupe' && cage.occupants?.pigeon) {
            const pigeon = cage.occupants.pigeon
            return `Cage ${cage.numero} - ${cage.nom}\nPigeon: ${pigeon.bague}\nRace: ${pigeon.race || '—'}`
        } else if (cage.statut === 'couple' && cage.occupants?.male && cage.occupants?.femelle) {
            const male = cage.occupants.male
            const femelle = cage.occupants.femelle
            return `Cage ${cage.numero} - ${cage.nom}\nCouple:\n♂ ${male.bague}\n♀ ${femelle.bague}`
        }
        return `Cage ${cage.numero} - ${cage.nom}`
    }

    const birds = getBirds()

    return (
        <button
            onClick={onClick}
            title={getTooltipContent()}
            className={`
                group relative flex aspect-square flex-col items-center justify-between 
                overflow-hidden rounded-xl p-2 text-center shadow-sm ring-1 
                transition-all hover:-translate-y-0.5 hover:shadow-md
                ${getCageStyle()}
                ${active ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''}
            `}
        >
            {/* Numéro de cage */}
            <div className="self-start text-[11px] font-bold tracking-wide">
                {cage.numero}
            </div>

            {/* Icônes pigeons */}
            <div className="flex items-center gap-0.5">
                {birds === 0 && <Bird className="h-6 w-6 opacity-30" strokeWidth={1.5} />}
                {birds === 1 && <Bird className="h-7 w-7" strokeWidth={1.75} />}
                {birds === 2 && (
                    <>
                        <Bird className="h-6 w-6 -mr-1" strokeWidth={1.75} />
                        <Bird className="h-6 w-6" strokeWidth={1.75} />
                    </>
                )}
            </div>

            {/* Label */}
            <div className="text-[10px] font-medium opacity-80">
                {getLabel()}
            </div>

            {/* Affichage de l'identifiant du pigeon au survol (cage occupée uniquement) */}
            {cage.statut === 'occupe' && cage.occupants?.pigeon && (
                <div className="absolute inset-0 bg-cage-single/95 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <div className="text-white text-center">
                        <div className="text-xs font-bold mb-1">{cage.occupants.pigeon.bague}</div>
                        <div className="text-[10px] opacity-90">{cage.occupants.pigeon.race || '—'}</div>
                    </div>
                </div>
            )}

            {/* Affichage des identifiants du couple au survol */}
            {cage.statut === 'couple' && cage.occupants?.male && cage.occupants?.femelle && (
                <div className="absolute inset-0 bg-cage-couple/95 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <div className="text-white text-center">
                        <div className="text-[10px] font-bold">♂ {cage.occupants.male.bague}</div>
                        <div className="text-[10px] font-bold">♀ {cage.occupants.femelle.bague}</div>
                    </div>
                </div>
            )}
        </button>
    )
}
