import api from '../axios'

/**
 * Service pour gérer les couples
 */
export const coupleService = {
    /**
     * Récupérer tous les couples
     */
    getAll: async () => {
        const response = await api.get('/couples')
        return response.data
    },

    /**
     * Récupérer un couple par ID
     */
    getById: async (id) => {
        const response = await api.get(`/couples/${id}`)
        return response.data
    },

    /**
     * Créer un nouveau couple
     */
    create: async (data) => {
        const response = await api.post('/couples', data)
        return response.data
    },

    /**
     * Mettre à jour un couple
     */
    update: async (id, data) => {
        const response = await api.put(`/couples/${id}`, data)
        return response.data
    },

    /**
     * Supprimer un couple
     */
    delete: async (id) => {
        const response = await api.delete(`/couples/${id}`)
        return response.data
    },

    /**
     * Rompre un couple
     */
    rompre: async (id) => {
        const response = await api.post(`/couples/${id}/rompre`)
        return response.data
    },

    /**
     * Récupérer l'historique d'un couple
     */
    getHistory: async (id) => {
        const response = await api.get(`/couples/${id}/history`)
        return response.data
    }
}
