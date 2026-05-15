import { useSidebar } from '../context/SidebarContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { MenuIcon } from './icons'

function Header() {
    const { toggle } = useSidebar()
    const { title, subtitle } = usePageTitle()

    return (
        <header className="bg-white shadow-xl border-b border-border">
            <div className="flex items-center gap-4 px-6 py-3">
                {/* Bouton hamburger pour toggle sidebar */}
                <button
                    onClick={toggle}
                    className="p-2 hover:bg-muted rounded-md transition-colors md:hidden"
                    aria-label="Toggle sidebar"
                >
                    <MenuIcon className="w-5 h-5 text-foreground" />
                </button>

                {/* Icône de menu pour desktop */}
                <button
                    onClick={toggle}
                    className="hidden md:block p-2 hover:bg-muted rounded-md transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <MenuIcon className="w-5 h-5 text-foreground" />
                </button>

                {/* Titre dynamique de la page */}
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        {title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {subtitle}
                    </p>
                </div>
            </div>
        </header>
    )
}

export default Header
