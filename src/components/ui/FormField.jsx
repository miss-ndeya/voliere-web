/**
 * Composant FormField - Champ de formulaire réutilisable
 * Avec label, icône optionnelle, gestion d'erreurs
 */

function FormField({ 
    label, 
    name, 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    required = false,
    error = null,
    icon = null,
    disabled = false,
    className = ''
}) {
    return (
        <div className={className}>
            <label htmlFor={name} className="block text-sm font-medium text-foreground mb-2">
                {label}
                {required && <span className="text-accent ml-1">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {icon}
                    </div>
                )}
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`
                        w-full h-12 px-4 ${icon ? 'pl-11' : ''} 
                        border border-border rounded-lg bg-background text-foreground
                        focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                        disabled:bg-muted disabled:cursor-not-allowed
                        transition-all duration-200
                        ${error ? 'border-destructive focus:ring-destructive' : ''}
                    `}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    )
}

export default FormField
