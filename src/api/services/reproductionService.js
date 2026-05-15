import api from '../axios'

/**
 * Service pour la gestion des reproductions
 */
export const reproductionService = {
    /**
     * Récupérer toutes les reproductions
     */
    async getAll() {
        const response = await api.get('/reproductions')
        return response.data
    },

    /**
     * Récupérer une reproduction par ID
     */
    async getById(id) {
        const response = await api.get(`/reproductions/${id}`)
        return response.data
    },

    /**
     * Créer une nouvelle reproduction
     */
    async create(data) {
        const response = await api.post('/reproductions', data)
        return response.data
    },

    /**
     * Mettre à jour une reproduction
     */
    async update(id, data) {
        const response = await api.put(`/reproductions/${id}`, data)
        return response.data
    },

    /**
     * Supprimer une reproduction
     */
    async delete(id) {
        const response = await api.delete(`/reproductions/${id}`)
        return response.data
    },

    /**
     * Créer des pigeonneaux pour une reproduction
     */
    async createPigeonneaux(id, pigeonneaux) {
        const response = await api.post(`/reproductions/${id}/pigeonneaux`, { pigeonneaux })
        return response.data
    }
}
