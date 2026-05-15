/**
 * Composant Button avec le design Baay Pitàq
 * Variantes: primary, secondary, accent, destructive, outline, ghost
 */

function Button({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    ...props 
}) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
        primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
        accent: 'bg-accent text-accent-foreground hover:opacity-90 shadow-sm',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm',
        outline: 'border-2 border-border bg-transparent hover:bg-muted',
        ghost: 'hover:bg-muted hover:text-foreground',
    }
    
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    }
    
    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
