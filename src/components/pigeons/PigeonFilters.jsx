import { Search, Trash2Icon, X } from 'lucide-react'
import Input from '../ui/Input'

/**
 * Composant de filtres pour les pigeons
 */
export function PigeonFilters({ filters, onFilterChange, onReset }) {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value })
    }

    const hasActiveFilters = 
        filters.search !== '' || 
        filters.sexe !== 'tous' || 
        filters.statut !== 'actif' // "actif" est la valeur par défaut

    return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Recherche par bague */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            type="text"
                            value={filters.search}
                            onChange={(e) => handleChange('search', e.target.value)}
                            placeholder="Bague ou race..."
                            className="pl-10"
                        />
                    </div>

                {/* Filtre par sexe */}
                <div>
                    <select
                        id="sexe"
                        value={filters.sexe}
                        onChange={(e) => handleChange('sexe', e.target.value)}
                        className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-transparent shadow text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                        <option value="tous">Sexe</option>
                        <option value="male">♂ Mâles</option>
                        <option value="femelle">♀ Femelles</option>
                    </select>
                </div>

                {/* Filtre par statut */}
                <div>
                    <select
                        id="statut"
                        value={filters.statut}
                        onChange={(e) => handleChange('statut', e.target.value)}
                        className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-transparent shadow text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                        <option value="tous">Statut</option>
                        <option value="actif">Actif</option>
                        <option value="vendu">Vendu</option>
                        <option value="mort">Mort</option>
                        <option value="perdu">Perdu</option>
                        <option value="inactif">Inactif</option>
                    </select>
                </div>

                {/* Bouton reset */}
                <div className="flex items-end">
                    {hasActiveFilters && (
                        <button
                            onClick={onReset}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                        >
                            <Trash2Icon className="h-4 w-4" />
                            Réinitialiser
                        </button>
                    )}
                </div>
            </div>
    )
}
