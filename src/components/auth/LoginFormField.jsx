import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'

/**
 * Champ de formulaire de connexion avec icône et validation
 * Wrapper autour du composant Input standard avec design personnalisé pour le login
 */
export function LoginFormField({ 
    id,
    name,
    type,
    label,
    value,
    placeholder,
    error,
    touched,
    showPassword,
    onTogglePassword,
    onChange,
    onBlur,
    helperText
}) {
    // Déterminer l'icône selon le nom du champ
    const getIcon = () => {
        switch(name) {
            case 'email': return Mail
            case 'password': return Lock
            case 'password_confirmation': return Lock
            case 'name': return User
            default: return Mail
        }
    }
    
    const Icon = getIcon()
    const isPassword = name === 'password' || name === 'password_confirmation'

    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-semibold text-foreground">
                {label} {(name === 'name' || name === 'email' || name === 'password' || name === 'password_confirmation') && <span className="text-destructive">*</span>}
            </label>
            <div className="relative group">
                {/* Icône à gauche */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                    <Icon className="h-5 w-5" />
                </div>
                
                {/* Input */}
                <input
                    id={id}
                    name={name}
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`w-full h-12 pl-12 ${isPassword ? 'pr-12' : 'pr-4'} border-2 rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all ${
                        touched && error 
                            ? 'border-destructive focus:ring-destructive/10 focus:border-destructive' 
                            : 'border-border hover:border-primary/50'
                    }`}
                />
                
                {/* Bouton toggle password */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/50 z-10"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>
            
            {/* Message d'erreur */}
            {touched && error && (
                <p className="text-xs text-destructive flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="w-1.5 h-1.5 bg-destructive rounded-full"></span>
                    {error}
                </p>
            )}
            
            {/* Helper text */}
            {helperText && !error && (
                <p className="text-xs text-muted-foreground mt-1">
                    {helperText}
                </p>
            )}
        </div>
    )
}
