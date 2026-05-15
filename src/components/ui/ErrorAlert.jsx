/**
 * Composant ErrorAlert - Alerte d'erreur réutilisable
 * Avec animation et bouton de fermeture
 */

function ErrorAlert({ message, onClose }) {
    if (!message) return null

    return (
        <div className="animate-fadeIn p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-destructive font-medium">{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-destructive/60 hover:text-destructive transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}

export default ErrorAlert
