import { HomeIcon, Search } from 'lucide-react'
import { CageCard } from './CageCard'
import { Button } from '../ui'

/**
 * Grille responsive de cages avec état vide
 */
export function CageGridContainer({ cages, selectedId, onSelectCage, query, filter, onResetFilters }) {
    if (cages.length === 0) {
        return (
            <div className="text-center py-12">
                {!query && filter === 'all' ? (
                    <>
                        <div className="text-6xl mb-2 flex items-center justify-center"><HomeIcon className='w-12 h-12' /></div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucune cage créée</h3>
                        <p className="text-gray-600 mb-4">Commencez par créer des cages pour gérer votre volière</p>
                    </>
                ) : (
                    <>
                        <div className="text-6xl mb-2 flex items-center justify-center"><Search className='w-10 h-10' /></div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun résultat</h3>
                        <p className="text-gray-600 mb-4">
                            Aucune cage ne correspond à votre recherche ou au filtre sélectionné
                        </p>
                        <Button
                            variant="outline"
                            onClick={onResetFilters}
                            className="px-4 py-2 rounded-lg transition-colors focus:outline-none"
                        >
                            Réinitialiser les filtres
                        </Button>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {cages.map(cage => (
                <CageCard
                    key={cage.id}
                    cage={cage}
                    isSelected={selectedId === cage.id}
                    onClick={() => onSelectCage(cage)}
                />
            ))}
        </div>
    )
}
