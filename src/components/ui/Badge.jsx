/**
 * Composant Badge avec le design Baay Pitàq
 * Variantes: default, primary, secondary, accent, destructive, success, cage-free, cage-single, cage-couple
 */

export function Badge({ 
    children, 
    variant = 'default', 
    className = '', 
    ...props 
}) {
    const baseStyles = 'inline-flex items-center px-3 py-1 rounded-md text-sm font-medium'
    
    const variants = {
        default: 'bg-muted text-muted-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        accent: 'bg-accent text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        success: 'bg-green-100 text-green-700',
        'cage-free': 'bg-cage-free text-cage-free-foreground',
        'cage-single': 'bg-cage-single text-cage-single-foreground',
        'cage-couple': 'bg-cage-couple text-cage-couple-foreground',
    }
    
    return (
        <span 
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </span>
    )
}

export default Badge
