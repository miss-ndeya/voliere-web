/**
 * Utilitaires pour gérer les erreurs API
 */

/**
 * Extraire les erreurs de validation Laravel
 * 
 * Laravel retourne les erreurs dans ce format :
 * {
 *   message: "The given data was invalid.",
 *   errors: {
 *     email: ["The email has already been taken."],
 *     password: ["The password must be at least 8 characters."]
 *   }
 * }
 * 
 * Ou parfois juste :
 * {
 *   message: "Error message"
 * }
 * 
 * @param {Object} error - Erreur Axios
 * @returns {Object} Erreurs formatées { field: 'message' }
 */
export function extractValidationErrors(error) {
  if (!error.response) return {}
  
  const { data, status } = error.response
  
  // Erreur de validation (422)
  if (status === 422) {
    // Format standard Laravel avec errors
    if (data.errors) {
      const formattedErrors = {}
      
      Object.keys(data.errors).forEach(field => {
        const messages = data.errors[field]
        // Prendre le premier message d'erreur
        formattedErrors[field] = Array.isArray(messages) ? messages[0] : messages
      })
      
      return formattedErrors
    }
    
    // Format personnalisé avec juste un message
    // On retourne un objet vide car c'est une erreur générale, pas de champ
    return {}
  }
  
  return {}
}

/**
 * Obtenir le message d'erreur principal
 * 
 * @param {Object} error - Erreur Axios
 * @param {string} defaultMessage - Message par défaut
 * @returns {string} Message d'erreur
 */
export function getErrorMessage(error, defaultMessage = 'Une erreur est survenue') {
  if (!error.response) {
    return 'Erreur de connexion au serveur'
  }
  
  const { data, status } = error.response
  
  // Erreur de validation
  if (status === 422) {
    return data.message || 'Données invalides'
  }
  
  // Erreur d'authentification
  if (status === 401) {
    return 'Non authentifié'
  }
  
  // Erreur d'autorisation
  if (status === 403) {
    return 'Accès refusé'
  }
  
  // Ressource non trouvée
  if (status === 404) {
    return 'Ressource non trouvée'
  }
  
  // Erreur serveur
  if (status >= 500) {
    return 'Erreur serveur'
  }
  
  return data.message || defaultMessage
}

/**
 * Vérifier si c'est une erreur de validation
 * 
 * @param {Object} error - Erreur Axios
 * @returns {boolean}
 */
export function isValidationError(error) {
  return error.response?.status === 422
}

/**
 * Afficher toutes les erreurs de validation dans la console (debug)
 * 
 * @param {Object} error - Erreur Axios
 */
export function logValidationErrors(error) {
  if (isValidationError(error)) {
    console.group('🔴 Erreurs de validation')
    const errors = extractValidationErrors(error)
    Object.keys(errors).forEach(field => {
      console.error(`${field}: ${errors[field]}`)
    })
    console.groupEnd()
  }
}
