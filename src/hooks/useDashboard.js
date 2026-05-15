import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../api/services/dashboardService'

/**
 * Hook personnalisé pour les statistiques du Dashboard
 * Les calculs sont effectués côté serveur pour optimiser les performances
 */
export function useDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: dashboardService.getStats,
        staleTime: 30000, // 30 secondes
        refetchInterval: 60000 // Rafraîchir toutes les minutes
    })
}
