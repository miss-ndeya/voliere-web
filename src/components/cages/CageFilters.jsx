import { Search, Trash2Icon, X } from 'lucide-react'
import Input from '../ui/Input'
import { Select } from '../ui'

/**
 * Composant de filtres pour les cages
 */
export function CageFilters({ filters, onFilterChange, onReset }) {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value })
    }

    const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'tous')

    return (
        <div className="flex items-center gap-4">
            {/* Recherche */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id="search"
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                    placeholder="Numéro ou nom..."
                    className="pl-10 md:w-80"
                />
            </div>

            {/* Filtre par statut */}
            <div className='w-full md:w-80'>
            <Select
                // label="statut"
                value={filters.statut}
                onChange={(e) => handleChange('statut', e.target.value)}
                required
            >
                <option value="tous">Statut</option>
                <option value="libre">Libre</option>
                <option value="occupe">Occupée (1 pigeon)</option>
                <option value="couple">Couple</option>
            </Select>
            </div>

            {/* Bouton reset */}
            {hasActiveFilters && (
                <button
                    onClick={onReset}
                    className=" flex items-center justify-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                >
                    <Trash2Icon className="h-4 w-4" />
                    Réinitialiser
                </button>
            )}
        </div>
    )
}
