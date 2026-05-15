import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reproductionService } from '../api/services/reproductionService'
import { useToast } from '../context/ToastContext'

/**
 * Hook personnalisé pour gérer les reproductions
 */
export function useReproductions() {
    const queryClient = useQueryClient()
    const { showToast } = useToast()

    // Query pour récupérer toutes les reproductions
    const reproductionsQuery = useQuery({
        queryKey: ['reproductions'],
        queryFn: () => reproductionService.getAll(),
        onError: (error) => {
            showToast(error.response?.data?.message || 'Erreur lors du chargement des reproductions', 'error')
        }
    })

    // Mutation pour créer une reproduction
    const createMutation = useMutation({
        mutationFn: (data) => reproductionService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['reproductions'])
            queryClient.invalidateQueries(['couples'])
            showToast('Reproduction enregistrée avec succès', 'success')
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la création de la reproduction'
            showToast(message, 'error')
        }
    })

    // Mutation pour mettre à jour une reproduction
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => reproductionService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['reproductions'])
            showToast('Reproduction modifiée avec succès', 'success')
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la modification de la reproduction'
            showToast(message, 'error')
        }
    })

    // Mutation pour supprimer une reproduction
    const deleteMutation = useMutation({
        mutationFn: (id) => reproductionService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['reproductions'])
            showToast('Reproduction supprimée avec succès', 'success')
        },
        onError: (error) => {
            showToast(error.response?.data?.message || 'Erreur lors de la suppression de la reproduction', 'error')
        }
    })

    // Mutation pour créer des pigeonneaux
    const createPigeonneauxMutation = useMutation({
        mutationFn: ({ id, pigeonneaux }) => reproductionService.createPigeonneaux(id, pigeonneaux),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['reproductions'])
            queryClient.invalidateQueries(['pigeons'])
            showToast(data.message || 'Pigeonneaux créés avec succès', 'success')
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la création des pigeonneaux'
            showToast(message, 'error')
        }
    })

    return {
        // Data
        reproductions: reproductionsQuery.data,
        isLoading: reproductionsQuery.isLoading,
        error: reproductionsQuery.error,
        
        // Mutations avec mutateAsync
        createReproduction: createMutation.mutateAsync,
        updateReproduction: updateMutation.mutateAsync,
        deleteReproduction: deleteMutation.mutateAsync,
        createPigeonneaux: createPigeonneauxMutation.mutateAsync,
        
        // States
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isCreatingPigeonneaux: createPigeonneauxMutation.isPending,
    }
}
