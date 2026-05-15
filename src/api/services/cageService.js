import api from '../axios'

/**
 * Service pour gérer les cages
 */
export const cageService = {
    /**
     * Récupérer toutes les cages
     */
    getAll: async () => {
        const response = await api.get('/cages')
        return response.data
    },

    /**
     * Récupérer une cage par ID
     */
    getById: async (id) => {
        const response = await api.get(`/cages/${id}`)
        return response.data
    },

    /**
     * Créer une nouvelle cage
     */
    create: async (data) => {
        const response = await api.post('/cages', data)
        return response.data
    },

    /**
     * Mettre à jour une cage
     */
    update: async (id, data) => {
        const response = await api.put(`/cages/${id}`, data)
        return response.data
    },

    /**
     * Supprimer une cage
     */
    delete: async (id) => {
        const response = await api.delete(`/cages/${id}`)
        return response.data
    },

    /**
     * Affecter un pigeon ou couple à une cage
     */
    affecter: async (id, data) => {
        const response = await api.post(`/cages/${id}/affecter`, data)
        return response.data
    },

    /**
     * Libérer une cage
     */
    liberer: async (id) => {
        const response = await api.post(`/cages/${id}/liberer`)
        return response.data
    },

    /**
     * Récupérer l'historique d'une cage
     */
    getHistory: async (id, limit = null) => {
        const params = limit ? { limit } : {}
        const response = await api.get(`/cages/${id}/history`, { params })
        return response.data
    }
}
