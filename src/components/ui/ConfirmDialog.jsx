import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import Button from './Button'

/**
 * Composant ConfirmDialog réutilisable pour les confirmations
 * 
 * @param {boolean} isOpen - État d'ouverture du dialog
 * @param {function} onClose - Fonction appelée à la fermeture
 * @param {function} onConfirm - Fonction appelée à la confirmation
 * @param {string} title - Titre du dialog
 * @param {string} message - Message de confirmation
 * @param {string} type - Type de dialog ('danger', 'warning', 'info', 'success')
 * @param {string} confirmText - Texte du bouton de confirmation
 * @param {string} cancelText - Texte du bouton d'annulation
 * @param {boolean} isLoading - État de chargement
 */
function ConfirmDialog({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirmation',
    message = 'Êtes-vous sûr de vouloir continuer ?',
    type = 'warning',
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    isLoading = false
}) {
    if (!isOpen) return null

    const typeConfig = {
        danger: {
            icon: XCircle,
            iconColor: 'text-destructive',
            iconBg: 'bg-destructive/10',
            buttonVariant: 'destructive'
        },
        warning: {
            icon: AlertTriangle,
            iconColor: 'text-amber-600',
            iconBg: 'bg-amber-50',
            buttonVariant: 'default'
        },
        info: {
            icon: Info,
            iconColor: 'text-primary',
            iconBg: 'bg-primary/10',
            buttonVariant: 'default'
        },
        success: {
            icon: CheckCircle,
            iconColor: 'text-success',
            iconBg: 'bg-success/10',
            buttonVariant: 'default'
        }
    }

    const config = typeConfig[type] || typeConfig.warning
    const Icon = config.icon

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={!isLoading ? onClose : undefined}
            />
            
            {/* Dialog */}
            <div className="relative w-full max-w-md bg-card rounded-xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}>
                        <Icon className={`h-6 w-6 ${config.iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-muted-foreground mb-6">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            variant={config.buttonVariant}
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Chargement...' : confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog
