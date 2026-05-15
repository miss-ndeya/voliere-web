/**
 * Composant StatCard - Carte de statistique modulaire
 * 
 * @param {string} title - Titre de la statistique
 * @param {string|number} value - Valeur principale à afficher
 * @param {string} subtitle - Sous-titre ou description
 * @param {React.ReactNode} icon - Icône SVG ou composant
 * @param {string} iconBgColor - Couleur de fond de l'icône (ex: 'bg-primary/10')
 * @param {string} iconColor - Couleur de l'icône (ex: 'text-primary')
 * @param {string} valueColor - Couleur de la valeur (ex: 'text-foreground')
 * @param {string} className - Classes CSS additionnelles
 */

function StatCard({ 
    title, 
    value, 
    subtitle, 
    icon, 
    iconBgColor = 'bg-primary/10',
    iconColor = 'text-primary',
    valueColor = 'text-foreground',
    className = '' 
}) {
    return (
        <div className={`bg-card border-0 shadow-sm hover:shadow-md transition-shadow rounded-xl ${className}`}>
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-2 font-medium">
                            {title}
                        </p>
                        <p className={`text-4xl font-bold mb-1 ${valueColor}`}>
                            {value}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
                        <div className={`w-5 h-5 ${iconColor}`}>
                            {icon}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatCard
