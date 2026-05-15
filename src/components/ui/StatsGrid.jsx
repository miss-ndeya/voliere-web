/**
 * Composant StatsGrid - Grille responsive pour les statistiques
 * 
 * @param {React.ReactNode} children - Les StatCard à afficher
 * @param {number} cols - Nombre de colonnes sur desktop (2, 3 ou 4)
 * @param {string} className - Classes CSS additionnelles
 */

function StatsGrid({ children, cols = 4, className = '' }) {
    const colsClass = {
        2: 'lg:grid-cols-2',
        3: 'lg:grid-cols-3',
        4: 'lg:grid-cols-4'
    }

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${colsClass[cols]} gap-4 ${className}`}>
            {children}
        </div>
    )
}

export default StatsGrid
