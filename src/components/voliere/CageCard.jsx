import { Bird } from 'lucide-react'
import { Tooltip } from '../ui/Tooltip'

/**
 * Carte de cage individuelle
 */
export function CageCard({ cage, isSelected, onClick }) {
    const getColor = (statut) => {
        if (statut === 'libre') return 'bg-cage-free-soft ring-cage-free-border text-cage-free-border'
        if (statut === 'occupe') return 'bg-cage-single-soft ring-cage-single-border text-cage-single-border'
        if (statut === 'couple') return 'bg-cage-couple-soft ring-cage-couple-border text-cage-couple-border'
        return 'bg-gray-100 border-gray-300'
    }

    const getLabel = (statut) => {
        if (statut === 'libre') return 'Libre'
        if (statut === 'occupe') return '1 pigeon'
        if (statut === 'couple') return '2 pigeons'
        return ''
    }

    const getBirds = (statut) => {
        if (statut === 'libre') return 0
        if (statut === 'occupe') return 1
        if (statut === 'couple') return 2
        return 0
    }

    // Générer le contenu du tooltip (null si cage libre)
    const getTooltipContent = () => {
        // Pas de tooltip pour les cages libres
        if (cage.statut === 'libre') {
            return null
        }
        
        if (cage.statut === 'occupe' && cage.occupants?.pigeon) {
            const pigeon = cage.occupants.pigeon
            return (
                <div className="text-left">
                    <div className="text-xs opacity-90">
                       {pigeon.sexe === 'male' ? '♂' : '♀'} {pigeon.bague} - {pigeon.race}
                    </div>
                </div>
            )
        }
        
        if (cage.statut === 'couple' && cage.occupants?.male && cage.occupants?.femelle) {
            const male = cage.occupants.male
            const femelle = cage.occupants.femelle
            return (
                <div className="text-left">
                    <div className="text-xs opacity-90">
                        ♂ {male.bague} - {male.race}
                        <br />
                        ♀ {femelle.bague} - {femelle.race}
                    </div>
                </div>
            )
        }
        
        // Pas de tooltip si pas d'occupants
        return null
    }

    const birds = getBirds(cage.statut)

    return (
        <Tooltip content={getTooltipContent()} position="top">
            <button
                onClick={onClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onClick()
                    }
                }}
                aria-label={`Cage ${cage.numero}, ${getLabel(cage.statut)}`}
                tabIndex={0}
                className={`group relative flex aspect-square flex-col items-center justify-between overflow-hidden rounded-xl ${getColor(cage.statut)} p-2 text-center shadow-sm ring-1 transition-all hover:-translate-y-0.5 hover:shadow-md ${isSelected ? "ring-2 ring-offset-2 ring-offset-background" : ""} w-full`}
            >
                <div className="self-start text-[11px] font-bold tracking-wide">{cage.numero}</div>
                
                <div className="flex items-center justify-center gap-0.5 my-1 sm:my-2">
                    {birds === 0 && <Bird className="h-5 w-5 sm:h-6 sm:w-6 opacity-" strokeWidth={1.5} />}
                    {birds === 1 && <Bird className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.75} />}
                    {birds === 2 && (
                        <>
                            <Bird className="h-5 w-5 sm:h-6 sm:w-6 -mr-1" strokeWidth={1.75} />
                            <Bird className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
                        </>
                    )}
                </div>
                
                <div className="text-[10px] sm:text-xs ">{getLabel(cage.statut)}</div>
            </button>
        </Tooltip>
    )
}
