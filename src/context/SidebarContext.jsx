import { createContext, useContext, useState, useEffect } from 'react'

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
    // État du sidebar : true = expanded (avec texte), false = collapsed (icônes seulement)
    const [isExpanded, setIsExpanded] = useState(true)
    
    // État pour mobile : true = visible, false = caché
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    
    // Détection de la taille d'écran
    const [isMobile, setIsMobile] = useState(false)
    
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            
            // Sur mobile, fermer le sidebar par défaut
            if (mobile) {
                setIsMobileOpen(false)
            }
        }
        
        // Vérifier au chargement
        handleResize()
        
        // Écouter les changements de taille
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    
    const toggle = () => {
        if (isMobile) {
            // Sur mobile : ouvrir/fermer complètement
            setIsMobileOpen(!isMobileOpen)
        } else {
            // Sur desktop : expand/collapse (garder les icônes)
            setIsExpanded(!isExpanded)
        }
    }
    
    const expand = () => setIsExpanded(true)
    const collapse = () => setIsExpanded(false)
    const openMobile = () => setIsMobileOpen(true)
    const closeMobile = () => setIsMobileOpen(false)
    
    return (
        <SidebarContext.Provider value={{ 
            isExpanded, 
            isMobileOpen, 
            isMobile,
            toggle, 
            expand, 
            collapse,
            openMobile,
            closeMobile
        }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within SidebarProvider')
    }
    return context
}
