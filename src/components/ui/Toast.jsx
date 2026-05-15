import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

/**
 * Composant Toast pour les notifications
 */
function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, onClose])

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-500',
            textColor: 'text-white'
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-destructive',
            textColor: 'text-white'
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-accent',
            textColor: 'text-white'
        },
        info: {
            icon: Info,
            bgColor: 'bg-primary',
            textColor: 'text-white'
        }
    }

    const { icon: Icon, bgColor, textColor } = config[type] || config.success

    return (
        <div className={`${bgColor} ${textColor} rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md animate-in fade-in slide-in-from-right-5 duration-300`}>
            <Icon className="h-5 w-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

export default Toast
