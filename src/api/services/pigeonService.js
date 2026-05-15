import api from '../axios'

/**
 * Service pour la gestion des pigeons
 */
export const pigeonService = {
    /**
     * Récupérer tous les pigeons
     * @returns {Promise} Liste des pigeons avec leurs relations
     */
    async getAll() {
        const response = await api.get('/pigeons')
        return response.data
    },

    /**
     * Récupérer un pigeon par ID
     * @param {number} id - ID du pigeon
     * @returns {Promise} Détails du pigeon
     */
    async getById(id) {
        const response = await api.get(`/pigeons/${id}`)
        return response.data
    },

    /**
     * Créer un nouveau pigeon
     * @param {Object} data - Données du pigeon
     * @returns {Promise} Pigeon créé
     */
    async create(data) {
        const response = await api.post('/pigeons', data)
        return response.data
    },

    /**
     * Mettre à jour un pigeon
     * @param {number} id - ID du pigeon
     * @param {Object} data - Données à mettre à jour
     * @returns {Promise} Pigeon mis à jour
     */
    async update(id, data) {
        const response = await api.put(`/pigeons/${id}`, data)
        return response.data
    },

    /**
     * Supprimer un pigeon (soft delete)
     * @param {number} id - ID du pigeon
     * @returns {Promise}
     */
    async delete(id) {
        const response = await api.delete(`/pigeons/${id}`)
        return response.data
    },

    /**
     * Récupérer les pigeons disponibles (actifs et sans couple)
     * @returns {Promise} Liste des pigeons disponibles
     */
    async getDisponibles() {
        const response = await api.get('/pigeons-disponibles')
        return response.data
    },

    /**
     * Récupérer tous les pigeons (incluant inactifs et sortis)
     * @returns {Promise} Liste complète des pigeons
     */
    async getTous() {
        const response = await api.get('/pigeons-tous')
        return response.data
    }
}
