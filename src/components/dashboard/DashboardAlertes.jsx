import { Link } from 'react-router-dom'
import { AlertCircle, Egg, Home, Heart } from 'lucide-react'

const ICONS = {
  a_baguer: Egg,
  eclosion: Egg,
  couple_sans_cage: Home,
  cages_separees: Heart,
}

/**
 * Alertes métier pour l'éleveur (couvées, cages, etc.)
 */
export function DashboardAlertes({ alertes = [] }) {
  const visibles = alertes.filter((a) => a.message && a.count > 0)

  if (visibles.length === 0) return null

  return (
    <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <AlertCircle className="h-4 w-4 text-accent" />
        À faire dans la volière
      </div>
      <ul className="space-y-2">
        {visibles.map((alerte) => {
          const Icon = ICONS[alerte.type] || AlertCircle
          return (
            <li key={alerte.type}>
              <Link
                to={alerte.lien}
                className="flex items-center gap-3 rounded-lg bg-card px-3 py-2 text-sm hover:bg-muted/50 transition-colors border border-border"
              >
                <Icon className="h-4 w-4 text-accent shrink-0" />
                <span className="flex-1 text-foreground">{alerte.message}</span>
                <span className="text-xs font-medium text-muted-foreground">Voir →</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
