import { Plus, Search } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'

/**
 * Header de la page Volière avec titre, filtres et recherche
 */
export function VoliereHeader({ filter, setFilter, query, setQuery, counts, showResultCount = false, onAddCage }) {
    const filters = [
        { value: 'empty', label: 'Libres', count: counts.free, colorFocus: 'bg-cage-free-soft ring-cage-free-border', colorDefault: "bg-card ring-border hover:bg-muted", bgCircle: "bg-cage-free-border" },
        { value: 'pigeon', label: 'Pigeon seul', count: counts.single, color: 'red' },
        { value: 'couple', label: 'Couple', count: counts.couple, color: 'orange' },
    ]

    return (
        <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
            {/* Titre et bouton d'ajout */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl sm:text-3xl">Volière</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Vue d'ensemble de toutes les cages — cliquez pour gérer.
                    </p>
                </div>
                {onAddCage && (
                    <Button onClick={onAddCage} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Ajouter une cage
                    </Button>
                )}
            </div>

            {/* Filtres et recherche */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">


                <button
                    onClick={() => setFilter(filter === "empty" ? "all" : "empty")}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ring-1 transition ${filter === "empty" ? "bg-cage-free-soft ring-cage-free-border" : "bg-card ring-border hover:bg-muted"}`}
                >
                    <span className="h-2.5 w-2.5 rounded-full bg-cage-free-border" />
                    Libres ({counts.free})
                </button>
                <button
                    onClick={() => setFilter(filter === "pigeon" ? "all" : "pigeon")}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ring-1 transition ${filter === "pigeon" ? "bg-cage-single-soft ring-cage-single-border" : "bg-card ring-border hover:bg-muted"}`}
                >
                    <span className="h-2.5 w-2.5 rounded-full bg-cage-single-border" />
                    Pigeon seul ({counts.single})
                </button>
                <button
                    onClick={() => setFilter(filter === "couple" ? "all" : "couple")}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ring-1 transition ${filter === "couple" ? "bg-cage-couple-soft ring-cage-couple-border" : "bg-card ring-border hover:bg-muted"}`}
                >
                    <span className="h-2.5 w-2.5 rounded-full bg-cage-couple-border" />
                    Couple ({counts.couple})
                </button>

                <div className="relative w-full sm:ml-auto sm:w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Rechercher (numéro, bague...)"
                        className="pl-9"
                        aria-label="Rechercher une cage par numéro ou bague"
                    />
                </div>
            </div>
        </div>
    )
}
