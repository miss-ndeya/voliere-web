/**
 * Composant Sheet (panneau latéral) avec le design Baay Pitàq
 */

export function Sheet({ open, onOpenChange, children }) {
    if (!open) return null

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in"
                onClick={() => onOpenChange?.(false)}
            />
            
            {/* Sheet Content */}
            {children}
        </>
    )
}

export function SheetContent({ side = 'right', children, className = '' }) {
    const sideClasses = {
        right: 'right-0 top-0 bottom-0 animate-in slide-in-from-right-5',
        left: 'left-0 top-0 bottom-0 animate-in slide-in-from-left-5',
        top: 'top-0 left-0 right-0 animate-in slide-in-from-top-5',
        bottom: 'bottom-0 left-0 right-0 animate-in slide-in-from-bottom-5',
    }

    return (
        <div 
            className={`fixed z-50 bg-card border-border shadow-2xl overflow-y-auto ${
                side === 'right' || side === 'left' 
                    ? 'w-full sm:max-w-md' 
                    : 'h-auto max-h-[90vh]'
            } ${sideClasses[side]} ${className}`}
        >
            <div className="p-6">
                {children}
            </div>
        </div>
    )
}

export function SheetHeader({ children, className = '' }) {
    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            {children}
        </div>
    )
}

export function SheetTitle({ children, className = '' }) {
    return (
        <h2 className={`font-display text-2xl text-foreground ${className}`}>
            {children}
        </h2>
    )
}

export function SheetDescription({ children, className = '' }) {
    return (
        <p className={`text-sm text-muted-foreground ${className}`}>
            {children}
        </p>
    )
}

export default Sheet
