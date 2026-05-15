import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

/**
 * HeroCard - Carte d'accueil avec message de bienvenue et taux d'occupation
 */
export function HeroCard({ userName, activePigeons, occupiedCages, occupancyRate }) {
    return (
        <Card className="overflow-hidden border-border/60">
            <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
                <div>
                    <Badge variant="secondary" className="mb-3">
                        Aperçu en direct
                    </Badge>
                    <h2 className="font-display text-3xl md:text-4xl text-foreground">
                        Bonjour, {userName}
                    </h2>
                    <p className="mt-2 max-w-xl text-muted-foreground">
                        Votre volière compte{' '}
                        <strong className="text-foreground">{activePigeons}</strong> pigeons actifs 
                        répartis dans{' '}
                        <strong className="text-foreground">{occupiedCages}</strong> cage(s) occupée(s).
                    </p>
                </div>
                <div className="flex flex-col items-start gap-3 md:items-end">
                    <div className="text-sm text-muted-foreground">Taux d'occupation</div>
                    <div className="font-display text-5xl text-accent">{occupancyRate}%</div>
                    <div className="h-2 w-48 overflow-hidden rounded-full bg-muted">
                        <div 
                            className="h-full bg-accent transition-all duration-500" 
                            style={{ width: `${occupancyRate}%` }} 
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}
