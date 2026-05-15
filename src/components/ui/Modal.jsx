import { X } from 'lucide-react'
import { useEffect } from 'react'

/**
 * Composant Modal réutilisable
 */
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    // Fermer avec Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className={`relative bg-card rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                        aria-label="Fermer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    {children}
                </div>
            </div>
        </div>
    )
}
