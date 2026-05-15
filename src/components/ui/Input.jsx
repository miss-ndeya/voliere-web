/**
 * Composant Input avec le design Baay Pitàq
 */

export function Input({ 
    label, 
    error, 
    className = '', 
    ...props 
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-foreground mb-2">
                    {label}
                </label>
            )}
            <input
                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                    error ? 'border-destructive focus:ring-destructive' : ''
                } ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-destructive">{error}</p>
            )}
        </div>
    )
}

export default Input
