import { Egg, Pencil, Trash2, Plus } from 'lucide-react'
import Button from '../ui/Button'

/**
 * Card pour afficher une reproduction
 */
export function ReproductionCard({ reproduction, onEdit, onDelete, onCreatePigeonneaux }) {
    const isEclos = !!reproduction.date_eclosion
    const pigeonneauxCount = reproduction.pigeonneaux_count || 0
    const placesRestantes = reproduction.nb_jeunes - pigeonneauxCount

    return (
        <div className="bg-card rounded-lg shadow border border-border p-5 hover:shadow-lg transition-shadow">
            {/* Header avec statut */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Egg className={`h-5 w-5 ${isEclos ? 'text-cage-free' : 'text-cage-single'}`} />
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                        isEclos 
                            ? 'bg-cage-free-soft text-cage-free' 
                            : 'bg-cage-single-soft text-cage-single'
                    }`}>
                        {isEclos ? 'Éclos' : 'En cours'}
                    </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                    {reproduction.nb_jeunes} jeune{reproduction.nb_jeunes > 1 ? 's' : ''}
                </span>
            </div>

            {/* Couple */}
            <div className="mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-primary font-mono">♂ {reproduction.couple?.male?.bague}</span>
                    <span className="text-muted-foreground">×</span>
                    <span className="text-cage-couple font-mono">♀ {reproduction.couple?.femelle?.bague}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                    {reproduction.couple?.male?.race}
                </div>
            </div>

            {/* Dates */}
            <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Ponte:</span>
                    <span className="font-medium">{new Date(reproduction.date_ponte).toLocaleDateString('fr-FR')}</span>
                </div>
                {reproduction.date_eclosion && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Éclosion:</span>
                        <span className="font-medium">{new Date(reproduction.date_eclosion).toLocaleDateString('fr-FR')}</span>
                    </div>
                )}
            </div>

            {/* Pigeonneaux ou statut */}
            {isEclos ? (
                <div className="mb-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Pigeonneaux créés:</span>
                        <span className="font-semibold text-foreground">
                            {pigeonneauxCount} / {reproduction.nb_jeunes}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="mb-4 p-3 bg-cage-single/10 rounded-lg border border-cage-single/20">
                    <div className="flex items-center gap-2 text-sm text-cage-single">
                        <svg className="h-4 w-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">En cours d'incubation</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Renseignez la date d'éclosion pour créer les pigeonneaux
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-border">
                {isEclos && placesRestantes > 0 && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onCreatePigeonneaux(reproduction)}
                        className="flex-1 gap-2"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Pigeonneaux
                    </Button>
                )}
                <button
                    onClick={() => onEdit(reproduction)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Modifier"
                >
                    <Pencil className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onDelete(reproduction)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Supprimer"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
