import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coupleService } from '../api/services/coupleService'
import { useToast } from '../context/ToastContext'

/**
 * Hook personnalisé pour gérer les couples
 */
export function useCouples() {
    const queryClient = useQueryClient()
    const { showToast } = useToast()

    // Query pour récupérer tous les couples
    const couplesQuery = useQuery({
        queryKey: ['couples'],
        queryFn: () => coupleService.getAll(),
        onError: (error) => {
            showToast(error.response?.data?.message || 'Erreur lors du chargement des couples', 'error')
        }
    })

    // Mutation pour créer un couple
    const createMutation = useMutation({
        mutationFn: (data) => coupleService.create(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['couples'])
            queryClient.invalidateQueries(['cages'])
            queryClient.invalidateQueries(['cages-visualisation'])
            queryClient.invalidateQueries(['pigeons'])
            queryClient.invalidateQueries(['dashboard'])
            showToast('Couple créé avec succès', 'success')
            if (data?.cage_message) {
                showToast(data.cage_message, 'success')
            } else if (data?.avertissement) {
                showToast(data.avertissement, 'warning')
            }
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la création du couple'
            showToast(message, 'error')
        }
    })

    // Mutation pour mettre à jour un couple
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => coupleService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['couples'])
            showToast('Couple modifié avec succès', 'success')
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la modification du couple'
            showToast(message, 'error')
        }
    })

    // Mutation pour supprimer un couple
    const deleteMutation = useMutation({
        mutationFn: (id) => coupleService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['couples'])
            showToast('Couple supprimé avec succès', 'success')
        },
        onError: (error) => {
            showToast(error.response?.data?.message || 'Erreur lors de la suppression du couple', 'error')
        }
    })

    // Mutation pour rompre un couple
    const rompreMutation = useMutation({
        mutationFn: (id) => coupleService.rompre(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['couples'])
            showToast('Couple rompu avec succès', 'success')
        },
        onError: (error) => {
            showToast(error.response?.data?.message || 'Erreur lors de la rupture du couple', 'error')
        }
    })

    return {
        // Data
        couples: couplesQuery.data,
        isLoading: couplesQuery.isLoading,
        error: couplesQuery.error,
        
        // Mutations avec mutateAsync pour pouvoir attendre le résultat
        createCouple: createMutation.mutateAsync,
        updateCouple: updateMutation.mutateAsync,
        deleteCouple: deleteMutation.mutateAsync,
        rompreCouple: rompreMutation.mutateAsync,
        
        // States
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isRompre: rompreMutation.isPending,
    }
}
