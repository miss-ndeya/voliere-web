import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cageService } from '../api/services/cageService'
import { useToast } from '../context/ToastContext'

/**
 * Hook personnalisé pour gérer les cages
 */
export function useCages() {
    const queryClient = useQueryClient()
    const { showToast } = useToast()

    // Query pour récupérer toutes les cages
    const cagesQuery = useQuery({
        queryKey: ['cages'],
        queryFn: () => cageService.getAll(),
        onError: (error) => {
            showToast(error.response?.data?.message || 'Erreur lors du chargement des cages', 'error')
        }
    })

    // Mutation pour créer une cage
    const createMutation = useMutation({
        mutationFn: (data) => cageService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['cages'])
            queryClient.invalidateQueries(['cages-visualisation'])
            showToast('Cage créée avec succès', 'success')
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la création de la cage'
            showToast(message, 'error')
        }
    })

    // Mutation pour mettre à jour une cage
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => cageService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['cages'])
            queryClient.invalidateQueries(['cages-visualisation'])
            showToast('Cage modifiée avec succès', 'success')
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la modification de la cage'
            showToast(message, 'error')
        }
    })

    // Mutation pour supprimer une cage
    const deleteMutation = useMutation({
        mutationFn: (id) => cageService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['cages'])
            queryClient.invalidateQueries(['cages-visualisation'])
            showToast('Cage supprimée avec succès', 'success')
        },
        onError: (error) => {
            showToast(error.response?.data?.message || 'Erreur lors de la suppression de la cage', 'error')
        }
    })

    return {
        // Data
        cages: cagesQuery.data,
        isLoading: cagesQuery.isLoading,
        error: cagesQuery.error,
        
        // Mutations avec mutateAsync
        createCage: createMutation.mutateAsync,
        updateCage: updateMutation.mutateAsync,
        deleteCage: deleteMutation.mutateAsync,
        
        // States
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    }
}
