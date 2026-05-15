import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { authService } from '../../api/services/authService'
import { LoginFormField } from './LoginFormField'

/**
 * Formulaire d'inscription avec validation
 */
export function RegisterForm() {
    const navigate = useNavigate()
    const { setAuthData } = useAuth()
    const { showToast } = useToast()
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Le nom est requis'
                return ''
            case 'email':
                if (!value.trim()) return 'L\'email est requis'
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return 'Email invalide'
                }
                return ''
            case 'password':
                if (!value) return 'Le mot de passe est requis'
                if (value.length < 6) {
                    return 'Le mot de passe doit contenir au moins 6 caractères'
                }
                return ''
            case 'password_confirmation':
                if (!value) return 'Veuillez confirmer le mot de passe'
                if (value !== formData.password) {
                    return 'Les mots de passe ne correspondent pas'
                }
                return ''
            default:
                return ''
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        
        // Valider le champ si déjà touché
        if (touched[name]) {
            const error = validateField(name, value)
            setErrors(prev => ({ ...prev, [name]: error }))
        }
    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        setTouched(prev => ({ ...prev, [name]: true }))
        const error = validateField(name, value)
        setErrors(prev => ({ ...prev, [name]: error }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Valider tous les champs
        const newErrors = {
            name: validateField('name', formData.name),
            email: validateField('email', formData.email),
            password: validateField('password', formData.password),
            password_confirmation: validateField('password_confirmation', formData.password_confirmation)
        }
        
        setErrors(newErrors)
        setTouched({ name: true, email: true, password: true, password_confirmation: true })
        
        // Si erreurs de validation, ne pas soumettre
        if (Object.values(newErrors).some(error => error)) {
            showToast('Veuillez corriger les erreurs', 'error')
            return
        }

        setIsLoading(true)

        try {
            const response = await authService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            })

            // Vérifier que la réponse contient bien user et token
            if (response && response.user && response.token) {
                // Connexion automatique après inscription
                setAuthData(response.user, response.token)
                
                showToast(`Bienvenue ${response.user.name} !`, 'success')
                
                // Redirection vers le dashboard
                setTimeout(() => {
                    navigate('/')
                }, 500)
            } else {
                throw new Error('Réponse invalide du serveur')
            }
        } catch (error) {
            console.error('Register error:', error)
            const message = error.response?.data?.message || error.message || 'Erreur lors de l\'inscription'
            showToast(message, 'error')
            
            // Gérer les erreurs de validation du backend
            if (error.response?.data?.errors) {
                const backendErrors = {}
                Object.keys(error.response.data.errors).forEach(key => {
                    backendErrors[key] = Array.isArray(error.response.data.errors[key]) 
                        ? error.response.data.errors[key][0] 
                        : error.response.data.errors[key]
                })
                setErrors(prev => ({ ...prev, ...backendErrors }))
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200" 
            noValidate
            autoComplete="off"
        >
            {/* Champ Nom */}
            <LoginFormField
                id="name"
                name="name"
                type="text"
                label="Nom complet"
                value={formData.name}
                placeholder="Votre nom"
                error={errors.name}
                touched={touched.name}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            {/* Champ Email */}
            <LoginFormField
                id="email"
                name="email"
                type="email"
                label="Adresse email"
                value={formData.email}
                placeholder="exemple@email.com"
                error={errors.email}
                touched={touched.email}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            {/* Champs Mot de passe sur la même ligne */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Champ Mot de passe */}
                <LoginFormField
                    id="password"
                    name="password"
                    type="password"
                    label="Mot de passe"
                    value={formData.password}
                    placeholder="••••••••"
                    error={errors.password}
                    touched={touched.password}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText="Min. 6 caractères"
                />

                {/* Champ Confirmation mot de passe */}
                <LoginFormField
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    label="Confirmation"
                    value={formData.password_confirmation}
                    placeholder="••••••••"
                    error={errors.password_confirmation}
                    touched={touched.password_confirmation}
                    showPassword={showPasswordConfirm}
                    onTogglePassword={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </div>

            {/* Bouton d'inscription */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary text-white rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 font-semibold text-base flex items-center justify-center gap-2.5 mt-4"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Inscription en cours...</span>
                    </>
                ) : (
                    <span>Créer mon compte</span>
                )}
            </button>

            {/* Lien vers login */}
            <p className="text-center text-sm text-muted-foreground mt-3">
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                    Se connecter
                </Link>
            </p>
        </form>
    )
}
