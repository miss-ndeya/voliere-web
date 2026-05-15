import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLogout } from '../hooks/useLogout'
import { useToast } from '../context/ToastContext'

/**
 * Composant UserProfile
 * Affiche les informations de l'utilisateur connecté
 * @param {boolean} collapsed - Si true, affiche uniquement l'avatar
 */
function UserProfile({ collapsed = false }) {
    const { user } = useAuth()
    const { logout, isLoggingOut } = useLogout()
    const { showToast } = useToast()

    if (!user) return null

    const userInitial = user.name?.charAt(0).toUpperCase() || 'U'

    const handleLogout = async () => {
        const result = await logout()
        
        if (result?.success) {
            // Afficher le message d'au revoir
            showToast(`Au revoir ${result.userName} ! À bientôt`, 'success', 3000)
            
            // Rediriger après 1.5 secondes
            setTimeout(() => {
                result.navigate('/login')
            }, 1000)
        }
    }

    if (collapsed) {
        return (
            <div className="flex flex-col items-center gap-3">
                <div 
                    className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white text-sm font-semibold"
                    title={user.name}
                >
                    {userInitial}
                </div>
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="p-2.5 hover:bg-sidebar-accent/50 rounded-md transition-colors disabled:opacity-50"
                    title="Déconnexion"
                >
                    <LogOut className={`w-5 h-5 text-sidebar-foreground ${isLoggingOut ? 'animate-pulse' : ''}`} />
                </button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {userInitial}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                    {user.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                    {user.email}
                </p>
            </div>
            <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-1.5 hover:bg-sidebar-accent/50 rounded-md transition-colors flex-shrink-0 disabled:opacity-50"
                title="Déconnexion"
            >
                <LogOut className={`w-5 h-5 text-sidebar-foreground ${isLoggingOut ? 'animate-pulse' : ''}`} />
            </button>
        </div>
    )
}

export default UserProfile
