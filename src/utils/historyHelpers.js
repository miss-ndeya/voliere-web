/**
 * Utilitaires pour l'affichage de l'historique des cages
 */

export const getActionLabel = (action) => {
    const labels = {
        'affectation_pigeon': 'Pigeon affecté',
        'affectation_couple': 'Couple affecté',
        'liberation': 'Cage libérée',
        'creation': 'Cage créée'
    }
    return labels[action] || action
}

export const getActionColor = (action) => {
    const colors = {
        'affectation_pigeon': 'text-cage-couple bg-cage-couple-soft',
        'affectation_couple': 'text-cage-single bg-cage-couple-soft',
        'liberation': 'text-cage-free bg-cage-free-soft',
        'creation': 'text-primary bg-primary-foreground'
    }
    return colors[action] || 'text-muted-foreground bg-muted'
}

export const formatRelativeDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    
    return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
}

export const formatFullDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

