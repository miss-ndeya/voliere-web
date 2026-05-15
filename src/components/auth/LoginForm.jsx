import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../../hooks/useLogin'
import { useToast } from '../../context/ToastContext'
import { LoginFormField } from './LoginFormField'

/**
 * Formulaire de connexion avec validation
 */
export function LoginForm() {
    const { login, isLoading, error: backendError, validationErrors, clearError } = useLogin()
    const { showToast } = useToast()
    
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    // Afficher les erreurs du backend
    useEffect(() => {
        if (backendError) {
            // Afficher dans un toast
            showToast(backendError, 'error', 5000)
        }
        
        // Fusionner les erreurs de validation Laravel avec les erreurs locales
        if (validationErrors && Object.keys(validationErrors).length > 0) {
            const formattedErrors = {}
            Object.keys(validationErrors).forEach(key => {
                // Laravel retourne un tableau d'erreurs, on prend la première
                formattedErrors[key] = Array.isArray(validationErrors[key]) 
                    ? validationErrors[key][0] 
                    : validationErrors[key]
            })
            setErrors(prev => ({ ...prev, ...formattedErrors }))
            setTouched({ email: true, password: true })
        }
    }, [backendError, validationErrors, showToast])

    // Validation des champs
    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                if (!value) return 'L\'email est requis'
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
            default:
                return ''
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials(prev => ({ ...prev, [name]: value }))
        
        // Effacer les erreurs backend quand l'utilisateur modifie
        if (backendError) {
            clearError()
            setErrors({})
        }
        
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

    const handleSubmit = (e) => {
        // IMPORTANT: Empêcher le comportement par défaut du formulaire
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        
        // Valider tous les champs
        const newErrors = {
            email: validateField('email', credentials.email),
            password: validateField('password', credentials.password)
        }
        
        setErrors(newErrors)
        setTouched({ email: true, password: true })
        
        // Si erreurs de validation, ne pas soumettre
        if (newErrors.email || newErrors.password) {
            showToast('Veuillez corriger les erreurs', 'error')
            return false
        }
        
        // Soumettre le formulaire de manière asynchrone
        login(credentials)
            .then((result) => {
                if (result?.success) {
                    // Afficher le message de succès
                    showToast(`Bienvenue ${result.user.name} ! Redirection en cours...`, 'success', 1000)
                    
                    // Rediriger après 2 secondes
                    setTimeout(() => {
                        result.navigate('/')
                    }, 2000)
                }
            })
            .catch(err => {
                console.error('Login error:', err)
            })
        
        return false
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200" 
            noValidate
            autoComplete="off"
        >
                {/* Message d'erreur général du backend */}
                {backendError && !backendError.toLowerCase().includes('email') && !backendError.toLowerCase().includes('mot de passe') && !backendError.toLowerCase().includes('password') && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-sm text-destructive flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{backendError}</span>
                        </p>
                    </div>
                )}

                {/* Champ Email */}
                <LoginFormField
                    id="email"
                    name="email"
                    type="email"
                    label="Adresse email"
                    value={credentials.email}
                    placeholder="exemple@email.com"
                    error={errors.email}
                    touched={touched.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />

                {/* Champ Mot de passe */}
                <LoginFormField
                    id="password"
                    name="password"
                    type="password"
                    label="Mot de passe"
                    value={credentials.password}
                    placeholder="••••••••"
                    error={errors.password}
                    touched={touched.password}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />

                {/* Bouton de connexion */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-primary text-white rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 font-semibold text-base flex items-center justify-center gap-2.5 mt-6"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Connexion en cours...</span>
                        </>
                    ) : (
                        <span>Se connecter</span>
                    )}
                </button>

                {/* Lien vers inscription */}
                <p className="text-center text-sm text-muted-foreground mt-4">
                    Vous n'avez pas de compte ?{' '}
                    <Link to="/register" className="text-primary font-medium hover:underline">
                        Créer un compte
                    </Link>
                </p>
            </form>
        )
    }
