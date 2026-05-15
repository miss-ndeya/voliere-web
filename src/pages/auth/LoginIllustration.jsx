import Logo from '../../components/ui/Logo'

/**
 * Composant LoginIllustration - Illustration pour la page de connexion
 * Affichée uniquement sur desktop avec animations
 * Utilise le Logo de l'application et les couleurs du thème
 */

function LoginIllustration() {
    return (
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-8 animate-fadeIn">
            {/* Logo de l'application avec animation flottante */}
            <div className="relative animate-float">
                <div className="w-48 h-48 bg-card rounded-full flex items-center justify-center shadow-2xl border-4 border-accent/10">
                    <Logo size="xl" showText={false} />
                </div>
                {/* Cercles décoratifs */}
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-accent/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-primary/10 rounded-full animate-pulse delay-75"></div>
            </div>

            {/* Titre et description */}
            <div className="space-y-3">
                <h1 className="text-5xl font-bold text-foreground tracking-tight">
                    Baay Pitàq
                </h1>
                <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                    Gérez votre élevage de pigeons voyageurs avec simplicité et efficacité
                </p>
            </div>

            {/* Statistiques */}
            <div className="flex gap-8 pt-4">
                <div className="text-center transform hover:scale-110 transition-transform">
                    <div className="text-4xl font-bold text-accent mb-1">100+</div>
                    <div className="text-sm text-muted-foreground font-medium">Pigeons</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform">
                    <div className="text-4xl font-bold text-accent mb-1">50+</div>
                    <div className="text-sm text-muted-foreground font-medium">Couples</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform">
                    <div className="text-4xl font-bold text-accent mb-1">200+</div>
                    <div className="text-sm text-muted-foreground font-medium">Reproductions</div>
                </div>
            </div>

            {/* Points clés */}
            <div className="grid grid-cols-2 gap-4 pt-6 max-w-md">
                <div className="flex items-center gap-2 text-left">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-muted-foreground">Suivi complet</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-muted-foreground">Généalogie</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-muted-foreground">Statistiques</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-muted-foreground">Gestion cages</span>
                </div>
            </div>
        </div>
    )
}

export default LoginIllustration
