import { useState } from 'react'
import { X, Loader2, Bird, Clock, FileText, Baby } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCageHistory } from '../../hooks/useVoliere'
import { PigeonCard } from './PigeonCard'
import { HistoryEntry } from './HistoryEntry'

/**
 * Panneau latéral de détails de cage (pousse le contenu)
 */
export function CageDetailPanel({ 
    cage, 
    onClose, 
    pigeonsSansCage, 
    couplesSansCage, 
    pigeons,
    couples = [],
    reproductions = [],
    onAffecter, 
    onLiberer, 
    isLoading 
}) {
    const navigate = useNavigate()
    const [showForm, setShowForm] = useState(false)
    const [type, setType] = useState('')
    const [selectedId, setSelectedId] = useState('')

    const { data: history, isLoading: isLoadingHistory } = useCageHistory(cage.id, 2)

    const activeCouple = cage.statut === 'couple' && cage.occupants?.male && cage.occupants?.femelle
        ? couples.find(
            (c) => c.actif && c.male_id === cage.occupants.male.id && c.femelle_id === cage.occupants.femelle.id
          )
        : null

    const coupleARegrouper = cage.statut === 'occupe' && cage.occupants?.pigeon
        ? couples.find(
            (c) => c.actif && (c.male_id === cage.occupants.pigeon.id || c.femelle_id === cage.occupants.pigeon.id)
          )
        : null

    const coupleReproductions = activeCouple
        ? reproductions
            .filter((r) => r.couple_id === activeCouple.id)
            .slice(0, 3)
        : []

    const handleSubmit = (e) => {
        e.preventDefault()
        onAffecter(cage.id, type, parseInt(selectedId))
        setShowForm(false)
        setType('')
        setSelectedId('')
    }

     const statusBadge =
      cage.statut === "libre" ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cage-free-soft px-3 py-1 text-xs font-medium ring-1 ring-cage-free-border/40">
          <span className="h-2 w-2 rounded-full bg-cage-free-border" /> Libre
        </span>
      ) : cage.statut === "occupe" ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cage-single-soft text-cage-single px-3 py-1 text-xs font-medium ring-1 ring-cage-single-border">
          <Bird className="h-3 w-3" /> Occupée — 1 pigeon
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cage-couple-soft text-cage-couple px-3 py-1 text-xs font-medium ring-1 ring-cage-couple-border">
          <Bird className="h-3 w-3" /> Occupée par un couple
        </span>
      );

    return (
        <div className="w-full lg:w-80 bg-card border-t lg:border-t-0 lg:border-l border-border overflow-y-auto flex-shrink-0 mt-6 lg:mt-0">
            <div className="p-2 px-4 relative">
                {/* Loading overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-card/80 flex items-center justify-center z-10">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Traitement...</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-end items-center">
                    <button
                        onClick={onClose}
                        aria-label="Fermer le panneau"
                        className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded p-1"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <div>
                    <h2 className="font-display text-lg font-semibold text-foreground mb-1">Cage {cage.numero}</h2>
                    <p className='text-xs text-muted-foreground'>{cage.nom}</p>
                    </div>
                </div>

                {/* Status */}
                <div className="mb-3">{statusBadge}</div>

                {/* Pigeons */}
                {cage.statut !== 'libre' && (
                    <div className="mb-6 space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Pigeons</h3>
                        
                        {cage.statut === 'occupe' && cage.occupants?.pigeon && (
                            <PigeonCard pigeon={cage.occupants.pigeon} />
                        )}

                        {cage.statut === 'couple' && (
                            <>
                                {cage.occupants?.male && <PigeonCard pigeon={cage.occupants.male} />}
                                {cage.occupants?.femelle && <PigeonCard pigeon={cage.occupants.femelle} />}
                            </>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="border-t border-border pt-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Actions</h3>
                    
                    {cage.statut === 'libre' && !showForm && (
                        <div className="space-y-2">
                            <button
                                onClick={() => setShowForm(true)}
                                disabled={isLoading}
                                className="w-full bg-cage-single text-cage-single-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <Bird className="h-4 w-4" /> Affecter un pigeon
                            </button>
                            <button
                                onClick={() => { setShowForm(true); setType('couple') }}
                                disabled={isLoading}
                                className="w-full bg-cage-couple text-cage-couple-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <div className="flex items-center gap-0.5">
                                    <Bird className="h-4 w-4 -mr-1" />
                                    <Bird className="h-4 w-4" />
                                </div>
                                Affecter un couple
                            </button>
                        </div>
                    )}

                    {cage.statut !== 'libre' && (
                        <div className="space-y-2">
                            {coupleARegrouper && (
                                <button
                                    type="button"
                                    onClick={() => onAffecter(cage.id, 'couple', coupleARegrouper.id)}
                                    disabled={isLoading}
                                    className="w-full bg-cage-couple text-cage-couple-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                        <>
                                            <Bird className="h-4 w-4 -mr-1" />
                                            <Bird className="h-4 w-4" />
                                        </>
                                    )}
                                    Regrouper le couple ici
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => onLiberer(cage.id)}
                                disabled={isLoading}
                                className="w-full bg-destructive text-destructive-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                Libérer la cage
                            </button>
                        </div>
                    )}

                    {/* Formulaire */}
                    {showForm && (
                        <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-border pt-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-foreground mb-2">
                                    Type d'affectation
                                </label>
                                <select
                                    id="type"
                                    value={type}
                                    onChange={(e) => { setType(e.target.value); setSelectedId('') }}
                                    className="w-full border border-input bg-card text-foreground rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Choisir...</option>
                                    <option value="pigeon">Un pigeon</option>
                                    <option value="couple">Un couple</option>
                                </select>
                            </div>

                            {type === 'pigeon' && (
                                <div>
                                    <label htmlFor="pigeon" className="block text-sm font-medium text-foreground mb-2">
                                        Sélectionner un pigeon
                                    </label>
                                    <select
                                        id="pigeon"
                                        value={selectedId}
                                        onChange={(e) => setSelectedId(e.target.value)}
                                        className="w-full border border-input bg-card text-foreground rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="">Choisir...</option>
                                        {pigeonsSansCage.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.bague} — {p.race} ({p.sexe === 'male' ? '♂' : '♀'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {type === 'couple' && (
                                <div>
                                    <label htmlFor="couple" className="block text-sm font-medium text-foreground mb-2">
                                        Sélectionner un couple
                                    </label>
                                    <select
                                        id="couple"
                                        value={selectedId}
                                        onChange={(e) => setSelectedId(e.target.value)}
                                        className="w-full border border-input bg-card text-foreground rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="">Choisir...</option>
                                        {couplesSansCage.map(c => {
                                            const m = pigeons?.find(p => p.id === c.male_id)
                                            const f = pigeons?.find(p => p.id === c.femelle_id)
                                            return (
                                                <option key={c.id} value={c.id}>
                                                    {m?.bague} × {f?.bague}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setType(''); setSelectedId('') }}
                                    disabled={isLoading}
                                    className="flex-1 bg-muted text-muted-foreground py-2 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !selectedId}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring flex items-center justify-center gap-2 ${
                                        type === 'couple' 
                                            ? 'bg-cage-couple text-cage-couple-foreground hover:opacity-90' 
                                            : 'bg-cage-single text-cage-single-foreground hover:opacity-90'
                                    }`}
                                >
                                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Confirmer
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {coupleReproductions.length > 0 && (
                    <div className="border-t border-border pt-4 mt-4">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Baby className="h-4 w-4" />
                            Reproductions liées
                        </h3>
                        <div className="space-y-2">
                            {coupleReproductions.map((r) => (
                                <div key={r.id} className="rounded-lg border border-border p-3 text-sm">
                                    <p className="font-medium text-foreground">
                                        Ponte : {r.date_ponte ? new Date(r.date_ponte).toLocaleDateString('fr-FR') : '—'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {r.nombre_jeunes ?? r.nb_jeunes ?? 0} jeune(s)
                                        {r.date_eclosion && ` · Éclosion ${new Date(r.date_eclosion).toLocaleDateString('fr-FR')}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/reproductions')}
                            className="w-full mt-2 text-sm text-primary hover:underline"
                        >
                            Voir toutes les reproductions
                        </button>
                    </div>
                )}

                <div className="border-t border-border pt-4 mt-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Historique
                    </h3>
                    
                    {isLoadingHistory ? (
                        <div className="text-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
                        </div>
                    ) : history && history.length > 0 ? (
                        <>
                            <div className="space-y-2">
                                {history.map((entry, index) => (
                                    <HistoryEntry key={index} entry={entry} />
                                ))}
                            </div>
                            <button
                                onClick={() => navigate(`/cages/${cage.id}/historique`)}
                                className="w-full mt-3 text-sm text-primary hover:text-primary/80 font-medium flex items-center justify-center gap-2 py-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <FileText className="h-4 w-4" />
                                Voir tout l'historique
                            </button>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">Aucun historique disponible</p>
                    )}
                </div>
            </div>
        </div>
    )
}
