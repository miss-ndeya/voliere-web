import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Bird, Users, Baby, Home, LogOut } from 'lucide-react'
import api from '../../api/axios'
import Button from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

function PigeonHistorique() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useQuery({
        queryKey: ['pigeon-history', id],
        queryFn: () => api.get(`/pigeons/${id}/history`).then(res => res.data)
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Chargement...</p>
            </div>
        )
    }

    const { pigeon, reproductions, cage_history, enfants } = data || {}

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => navigate('/pigeons')}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                </Button>
                <div className="flex-1">
                    <h1 className="font-display text-3xl">Historique du pigeon</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {pigeon?.bague} — {pigeon?.race}
                    </p>
                </div>
            </div>

            {/* Informations du pigeon */}
            <div className="bg-card rounded-lg  border border-border p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-foreground rounded-lg">
                        <Bird className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Bague</p>
                            <p className="font-medium text-foreground">{pigeon?.bague}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Sexe</p>
                            <p className="font-medium text-foreground">
                                {pigeon?.sexe === 'male' ? '♂ Mâle' : '♀ Femelle'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Race</p>
                            <p className="font-medium text-foreground">{pigeon?.race}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Date de naissance</p>
                            <p className="font-medium text-foreground">
                                {pigeon?.date_naissance 
                                    ? new Date(pigeon.date_naissance).toLocaleDateString('fr-FR')
                                    : '-'
                                }
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Statut</p>
                            <Badge variant={pigeon?.statut === 'actif' ? 'success' : 'default'}>
                                {pigeon?.statut}
                            </Badge>
                        </div>
                        {pigeon?.pere && (
                            <div>
                                <p className="text-sm text-muted-foreground">Père</p>
                                <p className="font-medium text-foreground">♂ {pigeon.pere.bague}</p>
                            </div>
                        )}
                        {pigeon?.mere && (
                            <div>
                                <p className="text-sm text-muted-foreground">Mère</p>
                                <p className="font-medium text-foreground">♀ {pigeon.mere.bague}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enfants */}
            {(enfants?.comme_pere?.length > 0 || enfants?.comme_mere?.length > 0) && (
                <div className="bg-card rounded-lg shadow border border-border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Baby className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">Descendants</h2>
                    </div>
                    <div className="space-y-2">
                        {enfants.comme_pere?.map(enfant => (
                            <div key={enfant.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-foreground">{enfant.bague}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {enfant.sexe === 'male' ? '♂' : '♀'} {enfant.race}
                                        {enfant.mere && ` — Mère: ${enfant.mere.bague}`}
                                    </p>
                                </div>
                                <Badge variant={enfant.statut === 'actif' ? 'success' : 'default'}>
                                    {enfant.statut}
                                </Badge>
                            </div>
                        ))}
                        {enfants.comme_mere?.map(enfant => (
                            <div key={enfant.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-foreground">{enfant.bague}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {enfant.sexe === 'male' ? '♂' : '♀'} {enfant.race}
                                        {enfant.pere && ` — Père: ${enfant.pere.bague}`}
                                    </p>
                                </div>
                                <Badge variant={enfant.statut === 'actif' ? 'success' : 'default'}>
                                    {enfant.statut}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reproductions */}
            {reproductions && reproductions.length > 0 && (
                <div className="bg-card rounded-lg shadow border border-border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">Reproductions</h2>
                    </div>
                    <div className="space-y-3">
                        {reproductions.map(repro => (
                            <div key={repro.id} className="p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-medium text-foreground">
                                            ♂ {repro.couple?.male?.bague} × ♀ {repro.couple?.femelle?.bague}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Ponte: {new Date(repro.date_ponte).toLocaleDateString('fr-FR')}
                                            {repro.date_eclosion && ` — Éclosion: ${new Date(repro.date_eclosion).toLocaleDateString('fr-FR')}`}
                                        </p>
                                    </div>
                                    <Badge variant={repro.statut === 'reussi' ? 'success' : 'default'}>
                                        {repro.statut}
                                    </Badge>
                                </div>
                                {repro.pigeonneaux && repro.pigeonneaux.length > 0 && (
                                    <div className="mt-2 pl-4 border-l-2 border-primary/20">
                                        <p className="text-sm text-muted-foreground mb-1">Pigeonneaux:</p>
                                        {repro.pigeonneaux.map(p => (
                                            <p key={p.id} className="text-sm text-foreground">
                                                • {p.bague} ({p.sexe === 'male' ? '♂' : '♀'})
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Historique des cages */}
            {cage_history && cage_history.length > 0 && (
                <div className="bg-card rounded-lg shadow border border-border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Home className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">Historique des cages</h2>
                    </div>
                    <div className="space-y-2">
                        {cage_history.map(entry => (
                            <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-foreground">
                                        Cage {entry.cage?.numero}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {entry.action} — {new Date(entry.created_at).toLocaleDateString('fr-FR')} à {new Date(entry.created_at).toLocaleTimeString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sortie */}
            {pigeon?.sortie && (
                <div className="bg-card rounded-lg shadow border border-border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <LogOut className="h-5 w-5 text-destructive" />
                        <h2 className="text-xl font-semibold text-foreground">Sortie</h2>
                    </div>
                    <div className="p-4 bg-destructive/10 rounded-lg">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-medium text-foreground">
                                    {pigeon.sortie.type === 'vente' ? 'Vente' : pigeon.sortie.type === 'deces' ? 'Décès' : 'Perte'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Date: {new Date(pigeon.sortie.date_sortie).toLocaleDateString('fr-FR')}
                                </p>
                                {pigeon.sortie.type === 'vente' && (
                                    <>
                                        {pigeon.sortie.acheteur && (
                                            <p className="text-sm text-muted-foreground">
                                                Acheteur: {pigeon.sortie.acheteur}
                                            </p>
                                        )}
                                        {pigeon.sortie.prix && (
                                            <p className="text-sm font-medium text-foreground">
                                                Prix: {pigeon.sortie.prix} FCFA
                                            </p>
                                        )}
                                    </>
                                )}
                                {pigeon.sortie.type === 'deces' && pigeon.sortie.cause && (
                                    <p className="text-sm text-muted-foreground">
                                        Cause: {pigeon.sortie.cause}
                                    </p>
                                )}
                                {pigeon.sortie.type === 'perte' && pigeon.sortie.circonstance && (
                                    <p className="text-sm text-muted-foreground">
                                        Circonstance: {pigeon.sortie.circonstance}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PigeonHistorique
