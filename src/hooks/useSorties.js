import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sortieService } from '../api/services/sortieService'
import { useToast } from '../context/ToastContext'

/**
 * Hook personnalisé pour gérer les sorties
 * Centralise toutes les queries et mutations avec gestion d'erreurs et toasts
 */
export function useSorties() {
    const queryClient = useQueryClient()
    const { showToast } = useToast()

    // Query pour récupérer toutes les sorties
    const sortiesQuery = useQuery({
        queryKey: ['sorties'],
        queryFn: () => sortieService.getAll(),
        onError: (error) => {
            showToast(error.response?.data?.message || 'Erreur lors du chargement des sorties', 'error')
        }
    })

    // Mutation pour créer une sortie
    const createMutation = useMutation({
        mutationFn: (data) => sortieService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['sorties'])
            queryClient.invalidateQueries(['pigeons'])
            queryClient.invalidateQueries(['cages'])
            showToast('Sortie enregistrée avec succès', 'success')
        },
        onError: (error) => {
            // Ne pas afficher de toast pour les erreurs de validation (422)
            if (error.response?.status !== 422) {
                showToast(error.response?.data?.message || 'Erreur lors de l\'enregistrement de la sortie', 'error')
            }
        }
    })

    // Mutation pour mettre à jour une sortie
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => sortieService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['sorties'])
            queryClient.invalidateQueries(['pigeons'])
            showToast('Sortie modifiée avec succès', 'success')
        },
        onError: (error) => {
            // Ne pas afficher de toast pour les erreurs de validation (422)
            if (error.response?.status !== 422) {
                showToast(error.response?.data?.message || 'Erreur lors de la modification de la sortie', 'error')
            }
        }
    })

    // Mutation pour supprimer une sortie
    const deleteMutation = useMutation({
        mutationFn: (id) => sortieService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['sorties'])
            queryClient.invalidateQueries(['pigeons'])
            showToast('Sortie supprimée avec succès', 'success')
        },
        onError: (error) => {
            showToast(error.response?.data?.message || 'Erreur lors de la suppression de la sortie', 'error')
        }
    })

    return {
        // Data
        sorties: sortiesQuery.data,
        isLoading: sortiesQuery.isLoading,
        error: sortiesQuery.error,
        
        // Mutations avec mutateAsync
        createSortie: createMutation.mutateAsync,
        updateSortie: updateMutation.mutateAsync,
        deleteSortie: deleteMutation.mutateAsync,
        
        // States
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    }
}
