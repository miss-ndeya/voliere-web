import { Heart, Unlink, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui'

/**
 * Card pour afficher un couple - Design amélioré
 */
export function CoupleCard({ couple, onRompre, onEdit }) {
    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/couples/${couple.id}/historique`)
    }

    return (
        <div
            onClick={handleCardClick}
            className="bg-card rounded-lg shadow border border-border p-4 hover:shadow-lg transition-all cursor-pointer relative"
        >
            {/* Badge Rompu en haut à gauche */}
            {couple.actif && (
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-primary text-white">
                        Actif
                    </span>
                </div>
            )}
            {!couple.actif && (
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-primary-foreground text-primary">
                        Rompu
                    </span>
                </div>
            )}

            {/* Icône coeur en haut à droite */}
            <div className="absolute top-3 right-3">
                <Heart className={`h-5 w-5 text-cage-single`} />
            </div>

            {/* Contenu principal */}

            <div className="mt-8">
                {/* Pigeons du couple */}
                <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <PigeonChip label="♂" pigeon={couple.male} />
                    <span className="font-display text-2xl text-accent">×</span>
                    <PigeonChip label="♀" pigeon={couple.femelle} />
                </div>

                {/* Dates */}
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-3 border-t border-border">
                    <div>
                        <span className="font-medium">Depuis le</span> {new Date(couple.date_formation).toLocaleDateString('fr-FR')}
                    </div>
                   {couple.actif === 1 ? (
                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit(couple)
                                }}
                                title="Modifier"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRompre(couple)
                                }}
                                title="Rompre"
                            >
                                <Unlink className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    ) : null}
                    {!couple.actif && couple.updated_at && (
                        <div>
                            <span className="font-medium">Fin :</span> {new Date(couple.updated_at).toLocaleDateString('fr-FR')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function PigeonChip({ label, pigeon }) {
    return (
        <div className="rounded-lg bg-card p-3 text-center shadow-sm ring-1 ring-border">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="mt-1 truncate font-mono font-medium">{pigeon?.bague ?? "?"}</div>
            <div className="truncate text-xs text-muted-foreground">{pigeon?.nom ?? pigeon?.race ?? ""}</div>
        </div>
    );
}
