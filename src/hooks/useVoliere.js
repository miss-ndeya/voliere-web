import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cageService } from '../api/services/cageService'
import api from '../api/axios'

/**
 * Hook personnalisé pour la gestion de la volière
 * Sépare les queries et mutations de la page Visualisation
 */
export function useVoliere(filters = {}) {
    const queryClient = useQueryClient()

    // Query: Récupérer les cages avec filtres côté serveur
    const cagesQuery = useQuery({
        queryKey: ['cages-visualisation', filters],
        queryFn: () => cageService.getAll(filters),
        staleTime: 30000, // 30 secondes
        refetchInterval: 60000 // Rafraîchir toutes les minutes
    })

    // Query: Récupérer tous les pigeons
    const pigeonsQuery = useQuery({
        queryKey: ['pigeons'],
        queryFn: () => api.get('/pigeons').then(res => res.data),
        staleTime: 30000
    })

    // Query: Récupérer tous les couples
    const couplesQuery = useQuery({
        queryKey: ['couples'],
        queryFn: () => api.get('/couples').then(res => res.data),
        staleTime: 30000
    })

    // Mutation: Affecter un pigeon ou couple à une cage
    const assignMutation = useMutation({
        mutationFn: ({ cageId, type, id }) => cageService.assign(cageId, type, id),
        onSuccess: () => {
            queryClient.invalidateQueries(['cages-visualisation'])
            queryClient.invalidateQueries(['pigeons'])
            queryClient.invalidateQueries(['couples'])
        }
    })

    // Mutation: Libérer une cage
    const freeMutation = useMutation({
        mutationFn: (cageId) => cageService.free(cageId),
        onSuccess: () => {
            queryClient.invalidateQueries(['cages-visualisation'])
            queryClient.invalidateQueries(['pigeons'])
            queryClient.invalidateQueries(['couples'])
        }
    })

    return {
        // Queries
        cages: cagesQuery.data,
        pigeons: pigeonsQuery.data,
        couples: couplesQuery.data,
        isLoading: cagesQuery.isLoading,
        isError: cagesQuery.isError,
        error: cagesQuery.error,

        // Mutations
        assign: assignMutation.mutate,
        free: freeMutation.mutate,
        isAssigning: assignMutation.isPending,
        isFreeing: freeMutation.isPending,

        // Refetch
        refetch: cagesQuery.refetch
    }
}

/**
 * Hook pour récupérer l'historique d'une cage
 */
export function useCageHistory(cageId, limit = 2) {
    return useQuery({
        queryKey: ['cage-history', cageId, limit],
        queryFn: () => cageService.getHistory(cageId, limit),
        enabled: !!cageId,
        staleTime: 60000 // 1 minute
    })
}
