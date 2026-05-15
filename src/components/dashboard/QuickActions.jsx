import { Link } from 'react-router-dom'
import { Home, Bird, Heart, PackageMinus, ArrowRight } from 'lucide-react'
import { Card } from '../ui/Card'

/**
 * QuickActions - Liens rapides vers les principales actions
 */
export function QuickActions() {
    const actions = [
        { to: '/visualisation', label: 'Voir la volière', icon: Home },
        { to: '/pigeons', label: 'Ajouter un pigeon', icon: Bird },
        { to: '/couples', label: 'Former un couple', icon: Heart },
        { to: '/sorties', label: 'Enregistrer une sortie', icon: PackageMinus },
    ]

    return (
        <Card className="border-border/60">
            <Card.Content className="p-6">
                <h3 className="mb-4 font-display text-xl text-foreground">Actions rapides</h3>
                <div className="space-y-2">
                    {actions.map((action) => (
                        <Link
                            key={action.to}
                            to={action.to}
                            className="group flex items-center justify-between rounded-lg border border-border/60 p-3 transition-colors hover:border-accent hover:bg-accent/5"
                        >
                            <div className="flex items-center gap-3">
                                <action.icon className="h-4 w-4 text-accent" />
                                <span className="text-sm font-medium text-foreground">{action.label}</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    ))}
                </div>
            </Card.Content>
        </Card>
    )
}
