import logoUrl from '../../assets/logo-baay-pitaq.png'

/**
 * En-tête du formulaire de connexion avec logo et branding
 */
export function LoginHeader() {
    return (
        <>
            {/* Logo et branding */}
            <div className="flex items-center justify-center gap-3 animate-bounce transition-all duration-300">
                <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center shadow-lg p-0.5">
                    <div className="w-full h-full rounded-[14px] flex items-center justify-center">
                        <img 
                            src={logoUrl} 
                            alt="Baay Pitàq" 
                            className="w-9 h-9 object-contain"
                        />
                    </div>
                </div>
                <div>
                    <h1 className="text-xl font-display font-bold text-foreground">Baay Pitàq</h1>
                    <p className="text-xs text-muted-foreground">Gestion de volière</p>
                </div>
            </div>

            {/* Titre du formulaire */}
            <div className="space-y-2 text-center animate-in fade-in slide-in-from-top-5 duration-700 delay-100">
                <h2 className="text-xl font-display font-bold text-foreground">Bienvenue !</h2>
                <p className="text-muted-foreground text-sm">
                    Connectez-vous pour accéder à votre espace de gestion
                </p>
            </div>
        </>
    )
}
