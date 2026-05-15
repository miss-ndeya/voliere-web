import api from '../axios'

/**
 * Service pour les données du Dashboard
 * Utilise l'endpoint dédié qui calcule toutes les stats côté serveur
 */
export const dashboardService = {
    /**
     * Récupérer les statistiques du dashboard
     * @returns {Promise} Statistiques calculées côté serveur
     */
    async getStats() {
        const response = await api.get('/dashboard')
        return response.data
    }
}
