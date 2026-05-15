import { Baby, Bird, Grid3x3, Heart, HomeIcon, LayoutDashboard, Network, PackageMinus } from 'lucide-react';

/**
 * Configuration des liens de navigation
 * Centralisé pour faciliter la maintenance
 */
export const navigationLinks = [
    {
        to: '/',
        icon: LayoutDashboard,
        label: 'Tableau de bord'
    },
    {
        to: '/visualisation',
        icon: Grid3x3,
        label: 'Volière'
    },
    {
        to: '/pigeons',
        icon: Bird,
        label: 'Pigeons'
    },
    {
        to: '/cages',
        icon: HomeIcon,
        label: 'Cages'
    },
    {
        to: '/couples',
        icon: Heart,
        label: 'Couples'
    },
    {
        to: '/reproductions',
        icon: Baby,
        label: 'Reproductions'
    },
    {
        to: '/genealogie',
        icon: Network,
        label: 'Généalogie'
    },
    {
        to: '/sorties',
        icon: PackageMinus,
        label: 'Sorties'
    }
]
