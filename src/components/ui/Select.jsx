/**
 * Composant Select avec le design Baay Pitàq
 * 
 * Supporte deux modes d'utilisation :
 * 1. Avec prop options : <Select options={[{value: '1', label: 'Option 1'}]} />
 * 2. Avec children : <Select><option value="1">Option 1</option></Select>
 */

function Select({ 
    label, 
    error, 
    options = [],
    children,
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
            <select
                className={`w-full bg-transparent shadow rounded-md px-3 py-2.5 text-sm text-foreground 
                    focus:ring-1 focus:ring-ring focus:border-ring focus:outline-none 
                    transition-all duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:border-ring/50
                    ${error ? 'border-destructive focus:ring-destructive' : ''} 
                    ${className}`}
                {...props}
            >
                {/* Si children est fourni, l'utiliser, sinon utiliser options */}
                {children || options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1.5 text-sm text-destructive">{error}</p>
            )}
        </div>
    )
}

export default Select
