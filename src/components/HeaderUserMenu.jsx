import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLogout } from '../hooks/useLogout'
import { useToast } from '../context/ToastContext'

export function HeaderUserMenu() {
    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)
    const { user } = useAuth()
    const { logout, isLoggingOut } = useLogout()
    const { showToast } = useToast()
    const navigate = useNavigate()

    const userInitial = user?.name?.charAt(0).toUpperCase() || 'U'

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false)
            }
        }
        const handleEscape = (event) => {
            if (event.key === 'Escape') setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    const handleLogout = async () => {
        const result = await logout()
        setOpen(false)
        if (result?.success) {
            showToast(`Au revoir ${result.userName} !`, 'success', 3000)
            setTimeout(() => navigate('/login'), 800)
        }
    }

    if (!user) return null

    return (
        <div ref={menuRef} className="relative ml-auto shrink-0">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-3xl border border-border bg-card px-2 py-1 sm:px-3 sm:py-1 text-sm font-medium text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-white text-sm font-semibold">
                    {userInitial}
                </span>
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
                >
                    <div className="border-b border-border px-4 py-3">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                        <Link
                            to="/profile"
                            role="menuitem"
                            onClick={() => setOpen(false)}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                            <User className="h-4 w-4 text-accent" />
                            Mon profil
                        </Link>
                        <button
                            type="button"
                            role="menuitem"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                        >
                            <LogOut className={`h-4 w-4 ${isLoggingOut ? 'animate-pulse' : ''}`} />
                            {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
