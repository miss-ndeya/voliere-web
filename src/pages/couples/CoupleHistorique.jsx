import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Heart, Calendar, Egg, Bird } from 'lucide-react'
import { coupleService } from '../../api/services/coupleService'
import Button from '../../components/ui/Button'

function CoupleHistorique() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading, error } = useQuery({
        queryKey: ['couple-history', id],
        queryFn: () => coupleService.getHistory(id)
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Chargement de l'historique...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-destructive">Erreur lors du chargement de l'historique</p>
                <Button onClick={() => navigate('/couples')}>
                    Retour aux couples
                </Button>
            </div>
        )
    }

    const { couple, reproductions, stats } = data

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => navigate('/couples')}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                </Button>
                <div className="flex-1">
                    <h1 className="font-display text-3xl">Historique du couple</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Reproductions et statistiques
                    </p>
                </div>
            </div>

            {/* Informations du couple */}
            <div className="bg-card rounded-lg shadow border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-cage-couple/10 flex items-center justify-center">
                            <Heart className="h-6 w-6 text-cage-couple" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">
                                {couple.male?.bague} × {couple.femelle?.bague}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Formé le {new Date(couple.date_formation).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        couple.actif 
                            ? 'bg-cage-couple-soft text-cage-couple' 
                            : 'bg-muted text-muted-foreground'
                    }`}>
                        {couple.actif ? 'Actif' : 'Rompu'}
                    </span>
                </div>

                {/* Détails des pigeons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-primary font-medium">♂ Mâle</span>
                        </div>
                        <p className="font-medium text-foreground">{couple.male?.bague}</p>
                        <p className="text-sm text-muted-foreground">{couple.male?.race}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-cage-couple font-medium">♀ Femelle</span>
                        </div>
                        <p className="font-medium text-foreground">{couple.femelle?.bague}</p>
                        <p className="text-sm text-muted-foreground">{couple.femelle?.race}</p>
                    </div>
                </div>

                {/* Cage */}
                {couple.cage && (
                    <div className="p-4 bg-cage-couple/5 rounded-lg border border-cage-couple/20">
                        <p className="text-sm text-muted-foreground">Cage actuelle</p>
                        <p className="font-medium text-foreground">
                            {couple.cage.numero} — {couple.cage.nom}
                        </p>
                    </div>
                )}
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg shadow border border-border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stats.total_reproductions}</p>
                            <p className="text-sm text-muted-foreground">Reproductions</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-lg shadow border border-border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cage-couple/10 flex items-center justify-center">
                            <Egg className="h-5 w-5 text-cage-couple" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stats.total_enfants}</p>
                            <p className="text-sm text-muted-foreground">Enfants attendus</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-lg shadow border border-border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cage-free/10 flex items-center justify-center">
                            <Bird className="h-5 w-5 text-cage-free" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stats.total_pigeonneaux}</p>
                            <p className="text-sm text-muted-foreground">Pigeonneaux nés</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des reproductions */}
            <div className="bg-card rounded-lg shadow border border-border">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold text-foreground">Reproductions</h3>
                </div>
                <div className="divide-y divide-border">
                    {reproductions.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            Aucune reproduction enregistrée pour ce couple
                        </div>
                    ) : (
                        reproductions.map((reproduction) => (
                            <div key={reproduction.id} className="p-6 hover:bg-muted/30 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-medium text-foreground">
                                            Ponte du {new Date(reproduction.date_ponte).toLocaleDateString('fr-FR')}
                                        </p>
                                        {reproduction.date_eclosion && (
                                            <p className="text-sm text-muted-foreground">
                                                Éclosion le {new Date(reproduction.date_eclosion).toLocaleDateString('fr-FR')}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        reproduction.statut === 'en_cours' 
                                            ? 'bg-cage-single-soft text-cage-single-foreground' 
                                            : reproduction.statut === 'eclos'
                                            ? 'bg-cage-free-soft text-cage-free-foreground'
                                            : 'bg-muted text-muted-foreground'
                                    }`}>
                                        {reproduction.statut === 'en_cours' ? 'En cours' : 
                                         reproduction.statut === 'eclos' ? 'Éclos' : 'Terminé'}
                                    </span>
                                </div>
                                <div className="flex gap-6 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Œufs: </span>
                                        <span className="font-medium text-foreground">{reproduction.nombre_oeufs}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Éclos: </span>
                                        <span className="font-medium text-foreground">{reproduction.nombre_eclos}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Pigeonneaux: </span>
                                        <span className="font-medium text-foreground">{reproduction.pigeonneaux?.length || 0}</span>
                                    </div>
                                </div>
                                {reproduction.pigeonneaux && reproduction.pigeonneaux.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-border">
                                        <p className="text-sm text-muted-foreground mb-2">Pigeonneaux:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {reproduction.pigeonneaux.map((pigeonneau) => (
                                                <span
                                                    key={pigeonneau.id}
                                                    className="px-2 py-1 bg-muted rounded text-xs font-medium text-foreground"
                                                >
                                                    {pigeonneau.bague}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default CoupleHistorique
