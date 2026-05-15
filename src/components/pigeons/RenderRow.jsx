import { Archive, History, LogOut, Pencil } from 'lucide-react'

export const renderRow = (pigeon, { navigate, handleEdit, handleDeclareExit, handleArchive, isDeleting }) => {
    // Un pigeon peut être archivé s'il n'a pas de descendants et n'a pas de sortie
    const canArchive = !pigeon.has_descendants && !pigeon.sortie_id

    return (
        <tr key={pigeon.id} className="border-b border-border hover:bg-muted/50 transition-colors">
            <td className="p-2 sm:p-3 font-medium text-foreground">
                <div>
                    <div>{pigeon.bague}</div>
                    <div className="sm:hidden text-xs text-muted-foreground mt-0.5">
                        {pigeon.sexe === 'male' ? '♂ Mâle' : '♀ Femelle'} · {pigeon.race}
                    </div>
                </div>
            </td>
            <td className="hidden sm:table-cell p-2 sm:p-3 text-foreground">
                {pigeon.sexe === 'male' ? '♂ Mâle' : '♀ Femelle'}
            </td>
            <td className="hidden md:table-cell p-2 sm:p-3 text-foreground">{pigeon.race}</td>
            <td className="hidden lg:table-cell p-2 sm:p-3 text-muted-foreground text-xs">
                {pigeon.pere || pigeon.mere ? (
                    <div className="space-y-0.5">
                        {pigeon.pere && <div>♂ {pigeon.pere.bague}</div>}
                        {pigeon.mere && <div>♀ {pigeon.mere.bague}</div>}
                    </div>
                ) : (
                    '-'
                )}
            </td>
            <td className="hidden lg:table-cell p-2 sm:p-3 text-muted-foreground">
                {pigeon.date_naissance ? new Date(pigeon.date_naissance).toLocaleDateString('fr-FR') : '-'}
            </td>
            <td className="p-2 sm:p-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    pigeon.statut === 'actif'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : pigeon.statut === 'vendu'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : pigeon.statut === 'mort'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                    {pigeon.statut}
                </span>
            </td>
            <td className="p-2 sm:p-3">
                <div className="flex gap-1 sm:gap-2">
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
                    {pigeon.statut === 'actif' && (
                        <button
                            onClick={() => handleDeclareExit(pigeon)}
                            className="p-1.5 text-amber-600 hover:bg-amber-600/10 rounded transition-colors"
                            title="Déclarer une sortie"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    )}
                    {canArchive && (
                        <button
                            onClick={() => handleArchive(pigeon)}
                            className="p-1.5 text-gray-600 hover:bg-gray-600/10 rounded transition-colors disabled:opacity-50"
                            title="Archiver (sans descendants)"
                            disabled={isDeleting}
                        >
                            <Archive className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    )
}
