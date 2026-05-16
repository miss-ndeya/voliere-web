import { Link } from 'react-router-dom'
import { Baby } from 'lucide-react'
import { Card } from '../ui/Card'

/**
 * RecentReproductions - Liste des dernières reproductions
 */
export function RecentReproductions({ reproductions }) {
    return (
        <Card className="border-border/60 lg:col-span-2">
            <Card.Content className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-xl text-foreground">Dernières reproductions</h3>
                    <Link 
                        to="/reproductions" 
                        className="text-sm text-accent hover:underline"
                    >
                        Voir tout
                    </Link>
                </div>
                <div className="space-y-3">
                    {reproductions.length > 0 ? (
                        reproductions.map((r) => (
                            <div 
                                key={r.id} 
                                className="flex items-center gap-3 rounded-lg border border-border/60 p-3 hover:bg-muted/50 transition-colors"
                            >
                                <div className="grid h-9 w-9 place-items-center rounded-md bg-accent/15 text-accent">
                                    <Baby className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-foreground">
                                        {r.male.bague} × {r.femelle.bague}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Ponte le {new Date(r.date_ponte).toLocaleDateString('fr-FR')}
                                        {r.statut_label && ` · ${r.statut_label}`}
                                        {typeof r.nb_jeunes === 'number' && ` · ${r.nb_jeunes} jeune(s)`}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground flex items-center justify-center w-full h-auto">
                            Aucune reproduction enregistrée.
                        </div>
                    )}
                </div>
            </Card.Content>
        </Card>
    )
}
