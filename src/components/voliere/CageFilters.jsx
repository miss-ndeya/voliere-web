import { Search } from 'lucide-react'
import { Input } from '../ui/Input'

/**
 * CageFilters - Filtres et recherche pour les cages
 */
export function CageFilters({ filter, setFilter, query, setQuery, counts }) {
    const filters = [
        { 
            value: 'empty', 
            label: 'Libres', 
            count: counts.free,
            color: 'bg-cage-free/10 ring-cage-free/50 text-cage-free'
        },
        { 
            value: 'pigeon', 
            label: 'Pigeon seul', 
            count: counts.single,
            color: 'bg-cage-single/10 ring-cage-single/60 text-cage-single'
        },
        { 
            value: 'couple', 
            label: 'Couple', 
            count: counts.couple,
            color: 'bg-cage-couple/10 ring-cage-couple/60 text-cage-couple'
        },
    ]

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Filtres par statut */}
            {filters.map((f) => (
                <button
                    key={f.value}
                    onClick={() => setFilter(filter === f.value ? 'all' : f.value)}
                    className={`
                        flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ring-1 transition
                        ${filter === f.value 
                            ? f.color 
                            : 'bg-card ring-border hover:bg-muted text-foreground'
                        }
                    `}
                >
                    <span className={`h-2.5 w-2.5 rounded-full ${
                        filter === f.value ? 'bg-current' : 'bg-border'
                    }`} />
                    {f.label} ({f.count})
                </button>
            ))}

            {/* Barre de recherche */}
            <div className="relative ml-auto w-full max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher (numéro, bague...)"
                    className="pl-9"
                />
            </div>
        </div>
    )
}
