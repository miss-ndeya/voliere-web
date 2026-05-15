import { Outlet } from 'react-router-dom'
import { SidebarProvider, useSidebar } from '../context/SidebarContext'
import Sidebar from './Sidebar'
import Header from './Header'

function LayoutContent() {
    const { isExpanded, isMobile } = useSidebar()
    
    // Calculer le margin-left en fonction de l'état du sidebar
    const mainMarginLeft = isMobile ? '0' : (isExpanded ? '16rem' : '5rem') // 16rem = w-64, 5rem = w-20

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar fixe */}
            <Sidebar />

            {/* Contenu principal avec margin dynamique */}
            <div 
                className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
                style={{ marginLeft: mainMarginLeft }}
            >
                {/* Header fixe */}
                <Header />

                {/* Zone de contenu avec scroll */}
                <main className="flex-1 overflow-y-auto bg-secondary p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

function Layout() {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    )
}

export default Layout
