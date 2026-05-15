import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pigeonService } from '../api/services/pigeonService'
import { useToast } from '../context/ToastContext'

/**
 * Hook personnalisé pour gérer les pigeons
 * Centralise toutes les queries et mutations avec gestion d'erreurs et toasts
 */
export function usePigeons() {
    const queryClient = useQueryClient()
    const { showToast } = useToast()

    // Query pour récupérer tous les pigeons
    const pigeonsQuery = useQuery({
        queryKey: ['pigeons'],
        queryFn: () => pigeonService.getAll(),
        onError: (error) => {
            showToast(error.response?.data?.message || 'Erreur lors du chargement des pigeons', 'error')
        }
    })

    // Mutation pour créer un pigeon
    const createMutation = useMutation({
        mutationFn: (data) => pigeonService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['pigeons'])
            showToast('Pigeon créé avec succès', 'success')
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la création du pigeon'
            showToast(message, 'error')
        }
    })

    // Mutation pour mettre à jour un pigeon
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => pigeonService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['pigeons'])
            showToast('Pigeon modifié avec succès', 'success')
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la modification du pigeon'
            showToast(message, 'error')
        }
    })

    // Mutation pour supprimer un pigeon
    const deleteMutation = useMutation({
        mutationFn: (id) => pigeonService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['pigeons'])
            queryClient.invalidateQueries(['cages'])
            queryClient.invalidateQueries(['cages-visualisation'])
            queryClient.invalidateQueries(['couples'])
            queryClient.invalidateQueries(['dashboard'])
            showToast('Pigeon archivé avec succès', 'success')
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de l\'archivage du pigeon'
            showToast(message, 'error')
        }
    })

    return {
        // Data
        pigeons: pigeonsQuery.data,
        isLoading: pigeonsQuery.isLoading,
        error: pigeonsQuery.error,
        
        // Mutations avec mutateAsync pour pouvoir attendre le résultat
        createPigeon: createMutation.mutateAsync,
        updatePigeon: updateMutation.mutateAsync,
        deletePigeon: deleteMutation.mutateAsync,
        
        // States
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    }
}
