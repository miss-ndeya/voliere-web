import { createContext, useContext } from 'react'
import { useToast as useToastHook } from '../hooks/useToast'
import ToastContainer from '../components/ui/ToastContainer'

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
    const toast = useToastHook()

    return (
        <ToastContext.Provider value={toast}>
            <ToastContainer toasts={toast.toasts} onClose={toast.hideToast} />
            {children}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}
