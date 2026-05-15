import Toast from './Toast'

/**
 * Conteneur pour afficher les toasts
 */
function ToastContainer({ toasts, onClose }) {
    if (toasts.length === 0) return null

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => onClose(toast.id)}
                />
            ))}
        </div>
    )
}

export default ToastContainer
