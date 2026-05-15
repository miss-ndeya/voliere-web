import { Bird, Heart, Home, Egg } from 'lucide-react'

/**
 * Section gauche de la page login - Branding et fonctionnalités
 */
export function LoginBranding() {
    const features = [
        {
            icon: Bird,
            text: 'Suivi complet de vos oiseaux avec historique détaillé'
        },
        {
            icon: Heart,
            text: 'Gestion des accouplements et suivi des reproductions'
        },
        {
            icon: Egg,
            text: 'Suivi des naissances et généalogie complète'
        },
        {
            icon: Home,
            text: 'Organisation optimale de votre volière'
        }
    ]

    return (
        <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
            {/* Motifs décoratifs */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-white/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-2 border-white/10 rounded-full"></div>
            </div>

            {/* Contenu */}
            <div className="relative z-10 flex flex-col justify-center items-center p-8 text-white w-full">
                <div className="space-y-6 max-w-md">
                    <div className="space-y-3 text-center">
                        <h2 className="text-4xl font-display font-bold leading-tight">
                            Gérez votre élevage<br />
                            avec simplicité
                        </h2>
                        <p className="text-base text-white/90 leading-relaxed">
                            Une solution complète pour suivre vos pigeons, couples, reproductions et cages en toute sérénité.
                        </p>
                    </div>

                    {/* Fonctionnalités */}
                    <div className="flex flex-col gap-3">
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3.5 flex items-center gap-3 hover:bg-white/15 transition-all"
                            >
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <feature.icon className="w-5 h-5" />
                                </div>
                                <p className="text-sm text-white/90 leading-snug">
                                    {feature.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
