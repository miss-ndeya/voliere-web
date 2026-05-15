import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Loader2 } from 'lucide-react'
import { useCageHistory } from '../../hooks/useVoliere'
import { Card } from '../../components/ui/Card'
import { getActionLabel, getActionColor, formatFullDate } from '../../utils/historyHelpers'

/**
 * Page d'historique complet d'une cage
 */
function CageHistorique() {
    const { id } = useParams()
    const navigate = useNavigate()
    
    // Récupérer tout l'historique (limit = 0 pour tout récupérer)
    const { data: history, isLoading, isError } = useCageHistory(id, 0)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Chargement de l'historique...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive">Erreur lors du chargement de l'historique</p>
                <button
                    onClick={() => navigate('/visualisation')}
                    className="mt-4 text-primary hover:text-primary/80 font-medium"
                >
                    Retour à la volière
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/visualisation')}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    aria-label="Retour"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="font-display text-2xl sm:text-3xl">Historique complet</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Toutes les actions effectuées sur cette cage
                    </p>
                </div>
            </div>

            {/* Historique */}
            <Card>
                {history && history.length > 0 ? (
                    <div className="divide-y divide-border">
                        {history.map((entry, index) => (
                            <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                {formatFullDate(entry.created_at)}
                                            </span>
                                        </div>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getActionColor(entry.action)}`}>
                                            {getActionLabel(entry.action)}
                                        </div>
                                        {entry.details && (
                                            <p className="text-sm text-foreground mt-2">
                                                {entry.details}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">Aucun historique disponible</p>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default CageHistorique
