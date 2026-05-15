import { History, Pencil, Trash2 } from "lucide-react";

    // Fonction de rendu des lignes
    export const renderRow = (pigeon, {navigate, handleEdit, handleDeleteClick, isDeleting}, ) => (
        <tr key={pigeon.id} className="border-b border-border hover:bg-muted/50 transition-colors">
            <td className="p-3 font-medium text-foreground">{pigeon.bague}</td>
            <td className="p-3 text-foreground">
                {pigeon.sexe === 'male' ? '♂ Mâle' : '♀ Femelle'}
            </td>
            <td className="p-3 text-foreground">{pigeon.race}</td>
            <td className="p-3 text-muted-foreground text-xs">
                {pigeon.pere || pigeon.mere ? (
                    <div className="space-y-0.5">
                        {pigeon.pere && (
                            <div>♂ {pigeon.pere.bague}</div>
                        )}
                        {pigeon.mere && (
                            <div>♀ {pigeon.mere.bague}</div>
                        )}
                    </div>
                ) : (
                    '-'
                )}
            </td>
            <td className="p-3 text-muted-foreground">
                {pigeon.date_naissance ? new Date(pigeon.date_naissance).toLocaleDateString('fr-FR') : '-'}
            </td>
            <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${pigeon.statut === 'actif'
                    ? 'bg-cage-free-soft text-cage-free-foreground'
                    : pigeon.statut === 'vendu'
                        ? 'bg-cage-single-soft text-cage-single-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                    {pigeon.statut}
                </span>
            </td>
            <td className="p-3">
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/pigeons/${pigeon.id}/historique`)}
                        className="p-1.5 text-cage-single hover:bg-cage-single/10 rounded transition-colors"
                        title="Voir l'historique"
                    >
                        <History className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleEdit(pigeon)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Modifier"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(pigeon)}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                        title="Supprimer"
                        disabled={isDeleting}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    )