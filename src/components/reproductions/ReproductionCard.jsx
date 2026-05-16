import { Egg, Pencil, Trash2, Plus, Calendar } from 'lucide-react'
import Button from '../ui/Button'
import { getStatutLabel, STATUT } from '../../utils/reproductionWorkflow'

const STATUT_STYLES = {
  [STATUT.INCUBATION]: 'bg-cage-single-soft text-cage-single',
  [STATUT.ECLOSION_PREVUE]: 'bg-accent/15 text-accent',
  [STATUT.A_BAGUER]: 'bg-cage-couple-soft text-cage-couple',
  [STATUT.TERMINEE]: 'bg-cage-free-soft text-cage-free',
}

export function ReproductionCard({ reproduction, onEdit, onDelete, onCreatePigeonneaux }) {
  const statut = reproduction.statut || (reproduction.date_eclosion ? STATUT.A_BAGUER : STATUT.INCUBATION)
  const pigeonneauxCount = reproduction.pigeonneaux_count ?? 0
  const nbJeunes = reproduction.nb_jeunes ?? 0
  const placesRestantes = Math.max(0, nbJeunes - pigeonneauxCount)
  const canBaguer = reproduction.can_create_pigeonneaux ?? false
  const label = reproduction.statut_label || getStatutLabel(statut)

  const eclosionFuture =
    reproduction.date_eclosion &&
    new Date(reproduction.date_eclosion) > new Date(new Date().toDateString())

  return (
    <div className="bg-card rounded-lg shadow border border-border p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Egg className="h-5 w-5 text-accent" />
          <span className={`px-2 py-1 rounded text-xs font-medium ${STATUT_STYLES[statut] || STATUT_STYLES[STATUT.INCUBATION]}`}>
            {label}
          </span>
        </div>
        <span className="text-sm font-medium text-foreground">
          {nbJeunes} jeune{nbJeunes !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-primary font-mono">♂ {reproduction.couple?.male?.bague}</span>
          <span className="text-muted-foreground">×</span>
          <span className="text-cage-couple font-mono">♀ {reproduction.couple?.femelle?.bague}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">{reproduction.couple?.male?.race}</div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ponte:</span>
          <span className="font-medium">{new Date(reproduction.date_ponte).toLocaleDateString('fr-FR')}</span>
        </div>
        {reproduction.date_eclosion && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Éclosion:</span>
            <span className={`font-medium ${eclosionFuture ? 'text-accent' : ''}`}>
              {new Date(reproduction.date_eclosion).toLocaleDateString('fr-FR')}
              {eclosionFuture && ' (prévue)'}
            </span>
          </div>
        )}
      </div>

      {statut === STATUT.INCUBATION && (
        <div className="mb-4 p-3 bg-cage-single/10 rounded-lg border border-cage-single/20">
          <p className="text-sm text-cage-single font-medium">Incubation en cours</p>
          <p className="text-xs text-muted-foreground mt-1">
            Renseignez la date d&apos;éclosion une fois connue (min. 17 jours après la ponte).
          </p>
        </div>
      )}

      {statut === STATUT.ECLOSION_PREVUE && (
        <div className="mb-4 p-3 bg-accent/10 rounded-lg border border-accent/20 flex gap-2">
          <Calendar className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Éclosion à venir</p>
            <p className="text-xs text-muted-foreground mt-1">
              Le baguage des jeunes sera possible à partir du jour de l&apos;éclosion.
            </p>
          </div>
        </div>
      )}

      {statut === STATUT.A_BAGUER && (
        <div className="mb-3 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pigeonneaux bagués:</span>
            <span className="font-semibold text-foreground">
              {pigeonneauxCount} / {nbJeunes}
            </span>
          </div>
        </div>
      )}

      {statut === STATUT.TERMINEE && (
        <div className="mb-3 p-3 bg-cage-free-soft/50 rounded-lg text-sm text-muted-foreground">
          {nbJeunes === 0
            ? 'Couvée vide — reproduction clôturée.'
            : `Couvée terminée — ${pigeonneauxCount} pigeonneau(x) enregistré(s).`}
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-border">
        {canBaguer && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCreatePigeonneaux(reproduction)}
            className="flex-1 gap-2"
          >
            <Plus className="h-3.5 w-3.5" />
            Baguer ({placesRestantes})
          </Button>
        )}
        <button
          type="button"
          onClick={() => onEdit(reproduction)}
          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          title="Modifier"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(reproduction)}
          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
