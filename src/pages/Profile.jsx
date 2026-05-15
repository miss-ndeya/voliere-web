import { useState } from 'react'
import { User, Mail, Lock, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { authService } from '../api/services/authService'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function Profile() {
    const { user, setAuthData } = useAuth()
    const { showToast } = useToast()

    // État pour le formulaire de profil
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    })
    const [profileErrors, setProfileErrors] = useState({})
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

    // État pour le formulaire de mot de passe
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    })
    const [passwordErrors, setPasswordErrors] = useState({})
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

    // Gérer les changements du profil
    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfileData(prev => ({ ...prev, [name]: value }))
        if (profileErrors[name]) {
            setProfileErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    // Gérer les changements du mot de passe
    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    // Soumettre le formulaire de profil
    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setIsUpdatingProfile(true)

        try {
            const response = await authService.updateProfile(profileData)
            
            // Mettre à jour l'utilisateur dans le contexte
            setAuthData(response.user, localStorage.getItem('token'))
            
            showToast(response.message || 'Profil mis à jour avec succès', 'success')
            setProfileErrors({})
        } catch (error) {
            const message = error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
            showToast(message, 'error')
            
            if (error.response?.data?.errors) {
                setProfileErrors(error.response.data.errors)
            }
        } finally {
            setIsUpdatingProfile(false)
        }
    }

    // Soumettre le formulaire de mot de passe
    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setIsUpdatingPassword(true)

        try {
            const response = await authService.updatePassword(passwordData)
            
            showToast(response.message || 'Mot de passe modifié avec succès', 'success')
            
            // Réinitialiser le formulaire
            setPasswordData({
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
            })
            setPasswordErrors({})
        } catch (error) {
            const message = error.response?.data?.message || 'Erreur lors du changement de mot de passe'
            showToast(message, 'error')
            
            if (error.response?.data?.errors) {
                setPasswordErrors(error.response.data.errors)
            }
        } finally {
            setIsUpdatingPassword(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-display text-3xl font-bold text-foreground">Mon Profil</h1>
                <p className="text-muted-foreground mt-1">
                    Gérez vos informations personnelles et votre mot de passe
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Carte Informations personnelles */}
                <div className="bg-card rounded-lg shadow border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Informations personnelles</h2>
                            <p className="text-sm text-muted-foreground">Modifiez votre nom et email</p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        {/* Nom */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                Nom complet
                            </label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={profileData.name}
                                onChange={handleProfileChange}
                                placeholder="Votre nom"
                                disabled={isUpdatingProfile}
                            />
                            {profileErrors.name && (
                                <p className="text-sm text-destructive mt-1">{profileErrors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Adresse email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                placeholder="votre@email.com"
                                disabled={isUpdatingProfile}
                            />
                            {profileErrors.email && (
                                <p className="text-sm text-destructive mt-1">{profileErrors.email}</p>
                            )}
                        </div>

                        {/* Bouton */}
                        <Button
                            type="submit"
                            disabled={isUpdatingProfile}
                            className="w-full gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {isUpdatingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </form>
                </div>

                {/* Carte Mot de passe */}
                <div className="bg-card rounded-lg shadow border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                            <Lock className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Mot de passe</h2>
                            <p className="text-sm text-muted-foreground">Changez votre mot de passe</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        {/* Mot de passe actuel */}
                        <div>
                            <label htmlFor="current_password" className="block text-sm font-medium text-foreground mb-2">
                                Mot de passe actuel
                            </label>
                            <Input
                                id="current_password"
                                name="current_password"
                                type="password"
                                value={passwordData.current_password}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                disabled={isUpdatingPassword}
                            />
                            {passwordErrors.current_password && (
                                <p className="text-sm text-destructive mt-1">{passwordErrors.current_password}</p>
                            )}
                        </div>

                        {/* Nouveau mot de passe */}
                        <div>
                            <label htmlFor="new_password" className="block text-sm font-medium text-foreground mb-2">
                                Nouveau mot de passe
                            </label>
                            <Input
                                id="new_password"
                                name="new_password"
                                type="password"
                                value={passwordData.new_password}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                disabled={isUpdatingPassword}
                            />
                            {passwordErrors.new_password && (
                                <p className="text-sm text-destructive mt-1">{passwordErrors.new_password}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">Minimum 6 caractères</p>
                        </div>

                        {/* Confirmation */}
                        <div>
                            <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-foreground mb-2">
                                Confirmer le nouveau mot de passe
                            </label>
                            <Input
                                id="new_password_confirmation"
                                name="new_password_confirmation"
                                type="password"
                                value={passwordData.new_password_confirmation}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                disabled={isUpdatingPassword}
                            />
                        </div>

                        {/* Bouton */}
                        <Button
                            type="submit"
                            disabled={isUpdatingPassword}
                            variant="destructive"
                            className="w-full gap-2"
                        >
                            <Lock className="h-4 w-4" />
                            {isUpdatingPassword ? 'Modification...' : 'Changer le mot de passe'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile
