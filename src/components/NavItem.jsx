import { NavLink } from 'react-router-dom'

/**
 * Composant NavItem
 * Item de navigation réutilisable pour le sidebar
 * @param {string} to - Route de destination
 * @param {ReactNode} icon - Icône SVG
 * @param {string} label - Texte du lien
 * @param {boolean} collapsed - Si true, affiche uniquement l'icône
 * @param {Function} onClick - Callback au clic
 */
function NavItem({ to, icon, label, collapsed = false, onClick }) {
    return (
        <NavLink
            to={to}
            end={to === '/'}
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors ${
                    isActive
                        ? 'bg-sidebar-accent text-white font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : ''}
        >
            {icon}
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
        </NavLink>
    )
}

export default NavItem
