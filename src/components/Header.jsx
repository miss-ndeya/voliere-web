import { useSidebar } from '../context/SidebarContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { MenuIcon } from './icons'
import { HeaderUserMenu } from './HeaderUserMenu'

function Header() {
    const { toggle } = useSidebar()
    const { title, subtitle } = usePageTitle()

    return (
        <header className="bg-white shadow-xl border-b border-border">
            <div className="flex items-center gap-4 px-4 sm:px-6 py-3">
                <button
                    onClick={toggle}
                    className="p-2 hover:bg-muted rounded-md transition-colors md:hidden"
                    aria-label="Toggle sidebar"
                >
                    <MenuIcon className="w-5 h-5 text-foreground" />
                </button>

                <button
                    onClick={toggle}
                    className="hidden md:block p-2 hover:bg-muted rounded-md transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <MenuIcon className="w-5 h-5 text-foreground" />
                </button>

                <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {subtitle}
                        </p>
                    )}
                </div>

                <HeaderUserMenu />
            </div>
        </header>
    )
}

export default Header
