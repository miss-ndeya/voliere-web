import { useLocation } from 'react-router-dom'

/**
 * Hook pour obtenir le titre et sous-titre de la page actuelle
 * @returns {Object} { title, subtitle }
 */
export const usePageTitle = () => {
    const location = useLocation()

    const pageTitles = {
        '/': {
            title: 'Tableau de bord',
            subtitle: 'Vue d\'ensemble de votre élevage'
        },
        '/visualisation': {
            title: 'Volière',
            subtitle: 'Visualisation virtuelle de la voliére'
        },
        '/pigeons': {
            title: 'Pigeons',
            subtitle: 'Gestion individuelle des pigeons'
        },
        '/cages': {
            title: 'Cages',
            subtitle: 'Gestion de individuelle vos cages'
        },
        '/couples': {
            title: 'Couples',
            subtitle: 'Gestion des couples de pigeons'
        },
        '/reproductions': {
            title: 'Reproductions',
            subtitle: 'Pontes, naissances'
        },
        
        '/genealogie': {
            title: 'Généalogie',
            subtitle: 'Arbre généalogie de vos pigeons'
        },
        '/sorties': {
            title: 'Sorties',
            subtitle: 'Ventes, décès et pertes'
        }

    }

    return pageTitles[location.pathname] || {
        title: 'Baay Pitàq',
        subtitle: 'Gestion de volière'
    }
}
