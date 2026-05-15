import { Search, X, Calendar, Trash2Icon } from 'lucide-react'
import Input from '../ui/Input'

/**
 * Composant de filtres pour les sorties
 */
export function SortieFilters({ filters, onFilterChange, onReset }) {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value })
    }

    const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'tous')

    // Obtenir l'année actuelle et les 5 dernières années
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i)

    return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Recherche */}
               
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            type="text"
                            value={filters.search}
                            onChange={(e) => handleChange('search', e.target.value)}
                            placeholder="Bague, acheteur..."
                            className="pl-10"
                        />
                    </div>

                {/* Filtre par type */}
                <div>
                    
                    <select
                        id="type"
                        value={filters.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                        className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-transparent shadow text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                        <option value="tous">Statut</option>
                        <option value="vente">Vente</option>
                        <option value="deces">Décès</option>
                        <option value="perte">Perte</option>
                    </select>
                </div>

                {/* Filtre par mois */}
                <div>
                   
                    <select
                        id="mois"
                        value={filters.mois}
                        onChange={(e) => handleChange('mois', e.target.value)}
                        className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-transparent shadow text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                        <option value="tous">Mois</option>
                        <option value="01">Janvier</option>
                        <option value="02">Février</option>
                        <option value="03">Mars</option>
                        <option value="04">Avril</option>
                        <option value="05">Mai</option>
                        <option value="06">Juin</option>
                        <option value="07">Juillet</option>
                        <option value="08">Août</option>
                        <option value="09">Septembre</option>
                        <option value="10">Octobre</option>
                        <option value="11">Novembre</option>
                        <option value="12">Décembre</option>
                    </select>
                </div>

                {/* Filtre par année */}
                <div>
                    <select
                        id="annee"
                        value={filters.annee}
                        onChange={(e) => handleChange('annee', e.target.value)}
                        className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-transparent shadow text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                        <option value="tous">Année</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
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
