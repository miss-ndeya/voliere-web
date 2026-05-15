import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../api/services/authService'

/**
 * Hook personnalisé pour gérer la connexion
 * @returns {Object} État et fonctions de connexion
 */
export const useLogin = () => {
  const navigate = useNavigate()
  const { setAuthData } = useAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  /**
   * Soumettre le formulaire de connexion
   * @param {Object} credentials - Email et mot de passe
   */
  const login = async (credentials) => {
    setIsLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      // Utiliser authService qui fonctionne bien
      const data = await authService.login(credentials)
      
      // Mettre à jour le contexte avec les données reçues
      setAuthData(data.user, data.token)
      
      // Retourner succès pour que le composant puisse afficher un message
      return { success: true, user: data.user, navigate }
    } catch (err) {
      // Erreurs de validation Laravel (422)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
        setError('Veuillez corriger les erreurs')
      } 
      // Autres erreurs (401, 500, etc.)
      else {
        const errorMessage = err.response?.data?.message || 
                            'Une erreur est survenue lors de la connexion'
        setError(errorMessage)
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Réinitialiser l'erreur
   */
  const clearError = () => {
    setError(null)
    setValidationErrors({})
  }

  return {
    login,
    isLoading,
    error,
    validationErrors,
    clearError
  }
}
