import { CageTile } from './CageTile'

/**
 * CageGrid - Grille responsive pour afficher les cages
 */
export function CageGrid({ cages, selectedCageId, onCageClick }) {
    if (!cages || cages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center space-y-3">
                    <div className="text-6xl opacity-20">🏠</div>
                    <h3 className="font-display text-xl text-foreground">
                        Aucune cage disponible
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Commencez par créer des cages dans la section "Gestion des cages"
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {cages.map((cage) => (
                <CageTile
                    key={cage.id}
                    cage={cage}
                    active={selectedCageId === cage.id}
                    onClick={() => onCageClick(cage)}
                />
            ))}
        </div>
    )
}
