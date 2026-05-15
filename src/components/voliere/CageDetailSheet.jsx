import { X, Bird, Heart } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Select from '../ui/Select'
import { useState } from 'react'

/**
 * CageDetailSheet - Panneau latéral pour afficher les détails d'une cage
 * et permettre l'affectation/libération
 */
export function CageDetailSheet({ 
    cage, 
    onClose, 
    onAssignPigeon, 
    onAssignCouple, 
    onFree,
    availablePigeons = [],
    availableCouples = [],
    isLoading = false
}) {
    const [showAssignForm, setShowAssignForm] = useState(false)
    const [assignType, setAssignType] = useState('')
    const [selectedId, setSelectedId] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (assignType === 'pigeon') {
            onAssignPigeon(cage.id, parseInt(selectedId))
        } else {
            onAssignCouple(cage.id, parseInt(selectedId))
        }
        setShowAssignForm(false)
        setAssignType('')
        setSelectedId('')
    }

    const getBadgeVariant = () => {
        switch (cage.statut) {
            case 'libre': return 'cage-free'
            case 'occupe': return 'cage-single'
            case 'couple': return 'cage-couple'
            default: return 'default'
        }
    }

    const getStatusLabel = () => {
        switch (cage.statut) {
            case 'libre': return 'Cage libre'
            case 'occupe': return 'Occupée par 1 pigeon'
            case 'couple': return 'Occupée par un couple'
            default: return 'Statut inconnu'
        }
    }

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right-5">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="font-display text-2xl text-foreground">
                                Cage {cage.numero}
                            </h2>
                            {cage.nom && (
                                <p className="text-sm text-muted-foreground mt-1">{cage.nom}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Status Badge */}
                    <Badge variant={getBadgeVariant()}>
                        {getStatusLabel()}
                    </Badge>

                    {/* Occupant Details - Pigeon seul */}
                    {cage.statut === 'occupe' && cage.occupants?.pigeon && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2 text-foreground font-medium">
                                <Bird className="h-5 w-5 text-cage-single" />
                                <span>Pigeon</span>
                            </div>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Bague</span>
                                    <span className="font-medium text-foreground">
                                        {cage.occupants.pigeon.bague}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Race</span>
                                    <span className="text-foreground">
                                        {cage.occupants.pigeon.race}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Sexe</span>
                                    <span className="text-foreground">
                                        {cage.occupants.pigeon.sexe === 'male' ? '♂ Mâle' : '♀ Femelle'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Occupant Details - Couple */}
                    {cage.statut === 'couple' && cage.occupants?.male && cage.occupants?.femelle && (
                        <div className="space-y-3">
                            {/* Mâle */}
                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <Bird className="h-5 w-5 text-blue-600" />
                                    <span>♂ Mâle</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Bague</span>
                                        <span className="font-medium text-foreground">
                                            {cage.occupants.male.bague}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Race</span>
                                        <span className="text-foreground">
                                            {cage.occupants.male.race}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Femelle */}
                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <Bird className="h-5 w-5 text-pink-600" />
                                    <span>♀ Femelle</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Bague</span>
                                        <span className="font-medium text-foreground">
                                            {cage.occupants.femelle.bague}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Race</span>
                                        <span className="text-foreground">
                                            {cage.occupants.femelle.race}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3 pt-4 border-t border-border">
                        {cage.statut === 'libre' && !showAssignForm && (
                            <Button
                                onClick={() => setShowAssignForm(true)}
                                className="w-full"
                                disabled={isLoading}
                            >
                                <Heart className="h-4 w-4 mr-2" />
                                Affecter un pigeon / couple
                            </Button>
                        )}

                        {cage.statut !== 'libre' && (
                            <Button
                                onClick={() => onFree(cage.id)}
                                variant="destructive"
                                className="w-full"
                                disabled={isLoading}
                            >
                                Libérer la cage
                            </Button>
                        )}
                    </div>

                    {/* Assign Form */}
                    {showAssignForm && (
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-border">
                            <Select
                                label="Type d'affectation"
                                value={assignType}
                                onChange={(e) => {
                                    setAssignType(e.target.value)
                                    setSelectedId('')
                                }}
                                required
                            >
                                <option value="">Choisir...</option>
                                <option value="pigeon">Un pigeon</option>
                                <option value="couple">Un couple</option>
                            </Select>

                            {assignType === 'pigeon' && (
                                <Select
                                    label="Sélectionner un pigeon"
                                    value={selectedId}
                                    onChange={(e) => setSelectedId(e.target.value)}
                                    required
                                >
                                    <option value="">Choisir un pigeon...</option>
                                    {availablePigeons.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.bague} — {p.race} ({p.sexe === 'male' ? '♂' : '♀'})
                                        </option>
                                    ))}
                                </Select>
                            )}

                            {assignType === 'couple' && (
                                <Select
                                    label="Sélectionner un couple"
                                    value={selectedId}
                                    onChange={(e) => setSelectedId(e.target.value)}
                                    required
                                >
                                    <option value="">Choisir un couple...</option>
                                    {availableCouples.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.male?.bague} × {c.femelle?.bague}
                                        </option>
                                    ))}
                                </Select>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setShowAssignForm(false)
                                        setAssignType('')
                                        setSelectedId('')
                                    }}
                                    className="flex-1"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={!selectedId || isLoading}
                                >
                                    Confirmer
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    )
}
