import { getActionLabel, getActionColor, formatRelativeDate } from '../../utils/historyHelpers'

/**
 * Composant pour afficher une entrée d'historique
 */
export function HistoryEntry({ entry }) {
    return (
        <div className="bg-muted rounded-lg p-3 text-xs">
            <div className="flex items-start justify-between gap-2 mb-1">
                <span className={`font-semibold px-2 py-0.5 rounded ${getActionColor(entry.action)}`}>
                    {getActionLabel(entry.action)}
                </span>
                <span className="text-muted-foreground text-[10px] whitespace-nowrap">
                    {formatRelativeDate(entry.created_at)}
                </span>
            </div>
            {entry.details && (
                <p className="text-foreground leading-relaxed">{entry.details}</p>
            )}
        </div>
    )
}
