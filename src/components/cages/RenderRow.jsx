import { Pencil, Trash2, History } from 'lucide-react'

// Fonction de rendu des lignes
export const renderRow = (cage, { navigate, handleEdit, handleDeleteClick, isDeleting }) => (
    <tr key={cage.id} className="border-b border-border hover:bg-muted/50 transition-colors">
        <td className="p-3 font-medium text-foreground">{cage.numero}</td>
        <td className="p-3 text-foreground">{cage.nom}</td>
        <td className="p-3 text-muted-foreground">
            {cage.superficie ? `${cage.superficie} m²` : '-'}
        </td>
        <td className="p-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${cage.statut === 'libre'
                    ? 'bg-cage-free-soft text-cage-free-foreground'
                    : cage.statut === 'occupe'
                        ? 'bg-cage-single-soft text-cage-single-foreground'
                        : 'bg-cage-couple-soft text-cage-couple'
                }`}>
                {cage.statut === 'libre' ? 'Libre' : cage.statut === 'occupe' ? 'Occupée' : 'Couple'}
            </span>
        </td>
        <td className="p-3 text-muted-foreground text-sm">
            {cage.statut === 'libre' && '-'}
            {cage.statut === 'occupe' && cage.pigeon && (
                <div>{cage.pigeon.bague} — {cage.pigeon.race}</div>
            )}
            {cage.statut === 'couple' && cage.couple && (
                <div className="space-y-0.5">
                    <div>♂ {cage.couple.male?.bague}</div>
                    <div>♀ {cage.couple.femelle?.bague}</div>
                </div>
            )}
        </td>
        <td className="p-3">
            <div className="flex gap-2">
                <button
                    onClick={() => navigate(`/cages/${cage.id}/historique`)}
                    className="p-1.5 text-cage-single hover:bg-cage-single/10 rounded transition-colors"
                    title="Voir l'historique"
                >
                    <History className="h-4 w-4" />
                </button>
                <button
                    onClick={() => handleEdit(cage)}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                    title="Modifier"
                >
                    <Pencil className="h-4 w-4" />
                </button>
                <button
                    onClick={() => handleDeleteClick(cage)}
                    className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={cage.statut !== 'libre' ? 'Libérez la cage avant de la supprimer' : 'Supprimer'}
                    disabled={isDeleting}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </td>
    </tr>
)