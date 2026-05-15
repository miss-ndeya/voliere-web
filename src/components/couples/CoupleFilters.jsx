import { Search, Trash2, X } from 'lucide-react'
import Input from '../ui/Input'
import { Button } from '../ui'

/**
 * Composant de filtres pour les couples
 */
export function CoupleFilters({ filters, onFilterChange, onReset }) {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value })
    }

    const hasActiveFilters = filters.search !== ''

    return (
        <div className="flex items-center gap-3">
            {/* Recherche */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id="search"
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                    placeholder="Bague du mâle ou femelle..."
                    className="pl-10 md:min-w-80"
                    autoComplete="off"
                    aria-label="Rechercher un couple"
                />
            </div>

            {/* Bouton reset */}
            <div className="flex items-end">
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={onReset}
                        className="w-full flex items-center justify-center gap-2 text-xs py-0.5"
                    >
                        <Trash2 className="h-3 w-3" />
                        Réinitialiser
                    </Button>
                )}
            </div>
        </div>
    )
}
