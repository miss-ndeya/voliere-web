import { Bird, Heart, Home, TrendingUp } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import { useAuth } from '../context/AuthContext'
import { HeroCard, StatCard, RecentReproductions, QuickActions } from '../components/dashboard'

/**
 * Dashboard - Page d'accueil avec statistiques et actions rapides
 * Architecture modulaire avec composants réutilisables
 * Les statistiques sont calculées côté serveur
 */
function Dashboard() {
    const { user } = useAuth()
    const { data, isLoading } = useDashboard()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement du tableau de bord...</p>
                </div>
            </div>
        )
    }

    const { stats, recentReproductions } = data || {}

    // Configuration des cartes de statistiques
    const statCards = [
        { 
            label: 'Pigeons actifs', 
            value: stats?.pigeons?.actifs || 0, 
            icon: Bird, 
            hint: `${stats?.pigeons?.total || 0} au total` 
        },
        { 
            label: 'Couples actifs', 
            value: stats?.couples?.actifs || 0, 
            icon: Heart, 
            hint: 'En reproduction' 
        },
        { 
            label: 'Cages libres', 
            value: stats?.cages?.libres || 0, 
            icon: Home, 
            hint: `${stats?.cages?.total || 0} cages au total` 
        },
        { 
            label: 'Revenus ventes', 
            value: `${stats?.ventes?.revenu || 0} €`, 
            icon: TrendingUp, 
            hint: `${stats?.ventes?.nombre || 0} vente(s)` 
        },
    ]

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            {/* Hero Card */}
            <HeroCard 
                userName={user?.name || 'Baay'}
                activePigeons={stats?.pigeons?.actifs || 0}
                occupiedCages={stats?.cages?.occupees || 0}
                occupancyRate={stats?.cages?.tauxOccupation || 0}
            />

            {/* KPIs Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            {/* Quick links + Recent reproductions */}
            <div className="grid gap-4 lg:grid-cols-3">
                <RecentReproductions reproductions={recentReproductions || []} />
                <QuickActions />
            </div>
        </div>
    )
}

export default Dashboard
