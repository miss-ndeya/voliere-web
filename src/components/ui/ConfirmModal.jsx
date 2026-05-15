import { AlertTriangle, Loader2 } from 'lucide-react'
import { Modal } from './Modal'

/**
 * Modal de confirmation pour les actions destructives
 */
export function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirmer l\'action',
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    variant = 'destructive',
    isLoading = false
}) {
    const handleConfirm = () => {
        onConfirm()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="p-6">
                {/* Icon d'avertissement */}
                <div className="flex items-center justify-center mb-4">
                    <div className={`rounded-full p-3 ${
                        variant === 'destructive' 
                            ? 'bg-destructive/10' 
                            : 'bg-primary/10'
                    }`}>
                        <AlertTriangle className={`h-6 w-6 ${
                            variant === 'destructive' 
                                ? 'text-destructive' 
                                : 'text-primary'
                        }`} />
                    </div>
                </div>

                {/* Message */}
                <p className="text-center text-foreground mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 bg-muted py-2.5 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 ${
                            variant === 'destructive'
                                ? 'bg-destructive text-destructive-foreground hover:opacity-90'
                                : 'bg-primary text-primary-foreground hover:opacity-90'
                        }`}
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
