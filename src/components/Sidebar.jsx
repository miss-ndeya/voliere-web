import { useSidebar } from '../context/SidebarContext'
import UserProfile from './UserProfile'
import NavItem from './NavItem'
import { navigationLinks } from '../config/navigation'
import logoUrl from '../assets/logo-baay-pitaq.png'

function Sidebar() {
    const { isExpanded, isMobileOpen, isMobile, closeMobile } = useSidebar()

    // Fermer le sidebar sur mobile après un clic sur un lien
    const handleLinkClick = () => {
        if (isMobile) {
            closeMobile()
        }
    }

    const collapsed = !isExpanded && !isMobile

    return (
        <>
            {/* Overlay pour mobile uniquement */}
            {isMobile && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={closeMobile}
                />
            )}

            {/* Sidebar - Toujours fixe */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen
                    bg-sidebar text-sidebar-foreground
                    flex flex-col
                    transition-all duration-300 ease-in-out
                    ${isMobile
                        ? `${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
                        : `translate-x-0 ${isExpanded ? 'w-64' : 'w-20'}`
                    }
                `}
            >
                {/* Header du sidebar avec logo */}
                <div className={`px-4 border-b border-sidebar-border ${collapsed ? 'px-2' : ''}`}>
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'} px-2 py-3`}>
                        <div className={`grid ${collapsed ? 'w-10 h-10' : 'w-9 h-9'} shrink-0 place-items-center overflow-hidden rounded-lg bg-sidebar-accent transition-all`}>
                            <img src={logoUrl} alt="Baay Pitàq" width={36} height={36} className="h-7 w-7 object-contain" />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col leading-tight">
                                <span className="font-display text-lg">Baay Pitàq</span>
                                <span className="text-xs text-sidebar-foreground/70">Gestion de volière</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section Gestion */}
                <nav className="flex-1 p-3 overflow-y-auto">
                    <div className="mb-4">
                        {!collapsed && (
                            <p className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider p-2 px-3">
                                Gestion
                            </p>
                        )}
                        <div className="space-y-1">
                            {navigationLinks.map((link) => (
                                <NavItem
                                    key={link.to}
                                    to={link.to}
                                    icon={<link.icon className="w-4 h-4 flex-shrink-0" />}
                                    label={link.label}
                                    collapsed={collapsed}
                                    onClick={handleLinkClick}
                                />
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Footer du sidebar - Utilisateur */}
                <div className={`p-3 border-t border-sidebar-border ${collapsed ? 'px-2' : ''}`}>
                    <UserProfile collapsed={collapsed} />
                </div>
            </aside>
        </>
    )
}

export default Sidebar
