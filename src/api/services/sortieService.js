import api from '../axios'

/**
 * Service pour la gestion des sorties (ventes, décès, pertes)
 */
export const sortieService = {
    /**
     * Récupérer toutes les sorties
     * @returns {Promise} Liste des sorties
     */
    async getAll() {
        const response = await api.get('/sorties')
        return response.data
    },

    /**
     * Récupérer une sortie par ID
     * @param {number} id - ID de la sortie
     * @returns {Promise} Détails de la sortie
     */
    async getById(id) {
        const response = await api.get(`/sorties/${id}`)
        return response.data
    },

    /**
     * Créer une nouvelle sortie
     * @param {Object} data - Données de la sortie
     * @returns {Promise} Sortie créée
     */
    async create(data) {
        const response = await api.post('/sorties', data)
        return response.data
    },

    /**
     * Mettre à jour une sortie
     * @param {number} id - ID de la sortie
     * @param {Object} data - Données à mettre à jour
     * @returns {Promise} Sortie mise à jour
     */
    async update(id, data) {
        const response = await api.put(`/sorties/${id}`, data)
        return response.data
    },

    /**
     * Supprimer une sortie
     * @param {number} id - ID de la sortie
     * @returns {Promise}
     */
    async delete(id) {
        const response = await api.delete(`/sorties/${id}`)
        return response.data
    }
}
