import api from '../axios'

/**
 * Service d'authentification
 * Gère toutes les requêtes liées à l'authentification
 */
const authService = {
  /**
   * Connexion utilisateur
   * @param {Object} credentials - Email et mot de passe
   * @returns {Promise} Données utilisateur et token
   */
  login: async (credentials) => {
    const response = await api.post('/login', credentials)
    return response.data
  },

  /**
   * Inscription utilisateur
   * @param {Object} userData - Données d'inscription
   * @returns {Promise} Données utilisateur et token
   */
  register: async (userData) => {
    const response = await api.post('/register', userData)
    return response.data
  },

  /**
   * Déconnexion utilisateur
   * @returns {Promise}
   */
  logout: async () => {
    const response = await api.post('/logout')
    return response.data
  },

  /**
   * Récupérer l'utilisateur connecté
   * @returns {Promise} Données utilisateur
   */
  getCurrentUser: async () => {
    const response = await api.get('/user')
    return response.data
  },

  /**
   * Mettre à jour le profil
   * @param {Object} data - Nom et email
   * @returns {Promise}
   */
  updateProfile: async (data) => {
    const response = await api.put('/profile', data)
    return response.data
  },

  /**
   * Changer le mot de passe
   * @param {Object} data - Mot de passe actuel, nouveau et confirmation
   * @returns {Promise}
   */
  updatePassword: async (data) => {
    const response = await api.put('/profile/password', data)
    return response.data
  }
}

export default authService
export { authService }
