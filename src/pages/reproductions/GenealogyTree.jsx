import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { GitBranch, Network, ExternalLink } from 'lucide-react'
import { pigeonService } from '../../api/services/pigeonService'

function GenealogyTree() {
  const [selectedPigeonId, setSelectedPigeonId] = useState('')
  const [showGrandparents, setShowGrandparents] = useState(true)

  const { data: pigeons = [], isLoading } = useQuery({
    queryKey: ['pigeons-tous'],
    queryFn: () => pigeonService.getTous(),
  })

  const selectedPigeon = pigeons.find((p) => p.id === parseInt(selectedPigeonId, 10))

  const genealogy = useMemo(() => {
    if (!selectedPigeon) return null

    const find = (id) => (id ? pigeons.find((p) => p.id === id) : null)

    const pere = find(selectedPigeon.pere_id)
    const mere = find(selectedPigeon.mere_id)

    const grandparents = {
      perePere: pere ? find(pere.pere_id) : null,
      pereMere: pere ? find(pere.mere_id) : null,
      merePere: mere ? find(mere.pere_id) : null,
      mereMere: mere ? find(mere.mere_id) : null,
    }

    const descendants = pigeons.filter(
      (p) => p.pere_id === selectedPigeon.id || p.mere_id === selectedPigeon.id
    )

    return {
      pere,
      mere,
      grandparents,
      hasGrandparents: Object.values(grandparents).some(Boolean),
      descendants,
      fils: descendants.filter((d) => d.sexe === 'male'),
      filles: descendants.filter((d) => d.sexe === 'femelle'),
    }
  }, [selectedPigeon, pigeons])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl">Arbre généalogique</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Parents, descendants et grands-parents (si renseignés dans les fiches)
        </p>
      </div>

      <div>
        <label htmlFor="pigeon-select" className="block text-sm font-medium text-foreground mb-2">
          Choisir un pigeon
        </label>
        <select
          id="pigeon-select"
          value={selectedPigeonId}
          onChange={(e) => setSelectedPigeonId(e.target.value)}
          className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-transparent shadow text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        >
          <option value="">Sélectionner un pigeon...</option>
          {pigeons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.bague} — {p.race} ({p.statut})
            </option>
          ))}
        </select>
      </div>

      {selectedPigeon && genealogy ? (
        <div className="bg-card p-4 sm:p-6 rounded-lg border border-border">
          <div className="max-w-4xl mx-auto space-y-8">
            {genealogy.hasGrandparents && (
              <section>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Grands-parents
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowGrandparents((v) => !v)}
                    className="text-xs text-accent hover:underline"
                  >
                    {showGrandparents ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
                {showGrandparents && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <GrandparentSlot label="Père du père" pigeon={genealogy.grandparents.perePere} onSelect={setSelectedPigeonId} />
                    <GrandparentSlot label="Mère du père" pigeon={genealogy.grandparents.pereMere} onSelect={setSelectedPigeonId} />
                    <GrandparentSlot label="Père de la mère" pigeon={genealogy.grandparents.merePere} onSelect={setSelectedPigeonId} />
                    <GrandparentSlot label="Mère de la mère" pigeon={genealogy.grandparents.mereMere} onSelect={setSelectedPigeonId} />
                  </div>
                )}
                <div className="flex justify-center mt-4">
                  <GitBranch className="h-5 w-5 text-muted-foreground rotate-180" />
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-3 tracking-wider">Père</p>
                <ParentCard pigeon={genealogy.pere} onSelect={setSelectedPigeonId} />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-3 tracking-wider">Mère</p>
                <ParentCard pigeon={genealogy.mere} onSelect={setSelectedPigeonId} />
              </div>
            </div>

            <div className="flex justify-center">
              <GitBranch className="h-6 w-6 text-accent" />
            </div>

            <div className="rounded-xl border border-accent bg-accent/5 p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Pigeon sélectionné</p>
              <p className="mt-1 font-display text-xl font-semibold">{selectedPigeon.bague}</p>
              <p className="text-xs text-muted-foreground">
                {selectedPigeon.race} · {selectedPigeon.sexe === 'male' ? 'Mâle' : 'Femelle'} · {selectedPigeon.statut}
              </p>
              <Link
                to={`/pigeons/${selectedPigeon.id}/historique`}
                className="inline-flex items-center gap-1 mt-3 text-xs text-accent hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Voir la fiche complète
              </Link>
            </div>

            {genealogy.descendants.length > 0 && (
              <>
                <div className="flex justify-center">
                  <GitBranch className="h-6 w-6 text-accent" />
                </div>
                <section>
                  <h3 className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
                    Descendance ({genealogy.descendants.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-3 text-center">Fils</p>
                      <div className="space-y-3">
                        {genealogy.fils.length > 0 ? (
                          genealogy.fils.map((f) => (
                            <DescendantCard key={f.id} pigeon={f} onSelect={setSelectedPigeonId} />
                          ))
                        ) : (
                          <p className="text-center py-4 text-sm text-muted-foreground">Aucun fils</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-3 text-center">Filles</p>
                      <div className="space-y-3">
                        {genealogy.filles.length > 0 ? (
                          genealogy.filles.map((f) => (
                            <DescendantCard key={f.id} pigeon={f} onSelect={setSelectedPigeonId} />
                          ))
                        ) : (
                          <p className="text-center py-4 text-sm text-muted-foreground">Aucune fille</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow border border-border p-10 sm:p-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Network className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">Aucun pigeon sélectionné</h3>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Sélectionnez un pigeon pour voir ses parents, grands-parents (si connus) et sa descendance.
          </p>
        </div>
      )}
    </div>
  )
}

function GrandparentSlot({ label, pigeon, onSelect }) {
  if (!pigeon) {
    return (
      <div className="p-3 rounded-lg border border-dashed border-border bg-muted/20 text-center">
        <p className="text-[10px] uppercase text-muted-foreground mb-1">{label}</p>
        <p className="text-xs text-muted-foreground">—</p>
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={() => onSelect(pigeon.id.toString())}
      className="p-3 rounded-lg border border-border bg-card hover:border-accent text-center w-full transition-colors"
    >
      <p className="text-[10px] uppercase text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-mono font-bold">{pigeon.bague}</p>
    </button>
  )
}

function ParentCard({ pigeon, onSelect }) {
  if (!pigeon) {
    return (
      <div className="p-6 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <p className="text-2xl font-bold text-muted-foreground mb-1">—</p>
        <p className="text-sm text-muted-foreground">Inconnu</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => onSelect(pigeon.id.toString())}
        className="w-full text-left hover:opacity-80 transition-opacity"
      >
        <p className="text-xl font-bold text-foreground mb-1 font-mono">{pigeon.bague}</p>
        <p className="text-sm text-muted-foreground">{pigeon.race}</p>
      </button>
      <Link
        to={`/pigeons/${pigeon.id}/historique`}
        className="inline-flex items-center gap-1 mt-3 text-xs text-accent hover:underline"
      >
        <ExternalLink className="h-3 w-3" />
        Fiche
      </Link>
    </div>
  )
}

function DescendantCard({ pigeon, onSelect }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => onSelect(pigeon.id.toString())}
        className="w-full text-center hover:opacity-80 transition-opacity"
      >
        <p className="text-lg font-bold text-foreground mb-1 font-mono">{pigeon.bague}</p>
        <p className="text-xs text-muted-foreground">{pigeon.race}</p>
      </button>
      <Link
        to={`/pigeons/${pigeon.id}/historique`}
        className="inline-flex items-center justify-center gap-1 w-full mt-2 text-xs text-accent hover:underline"
      >
        <ExternalLink className="h-3 w-3" />
        Fiche
      </Link>
    </div>
  )
}

export default GenealogyTree
