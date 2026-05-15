import { Card } from '../ui/Card'

/**
 * StatCard - Carte de statistique avec icône
 */
export function StatCard({ label, value, hint, icon: Icon }) {
    return (
        <Card className="border-border/60">
            <Card.Content className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-sm text-muted-foreground">{label}</div>
                        <div className="mt-2 font-display text-3xl text-foreground">{value}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
                    </div>
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </Card.Content>
        </Card>
    )
}
