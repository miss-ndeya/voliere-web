import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Hook personnalisé pour gérer la déconnexion avec toast et animation
 * @returns {Object} État et fonction de déconnexion
 */
export const useLogout = () => {
  const navigate = useNavigate()
  const { logout: authLogout, user } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  /**
   * Déconnexion avec message et redirection
   */
  const logout = async () => {
    setIsLoggingOut(true)

    try {
      // Appeler la déconnexion du contexte
      await authLogout()
      
      // Retourner les infos pour le toast
      return { 
        success: true, 
        userName: user?.name || 'Utilisateur',
        navigate: (path) => navigate(path, { state: { fromLogout: true } })
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
      // Même en cas d'erreur, on déconnecte côté client
      return { 
        success: true, 
        userName: user?.name || 'Utilisateur',
        navigate: (path) => navigate(path, { state: { fromLogout: true } })
      }
    } finally {
      setIsLoggingOut(false)
    }
  }

  return {
    logout,
    isLoggingOut
  }
}
