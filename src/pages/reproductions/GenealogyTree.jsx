import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GitBranch, Network } from 'lucide-react'
import { pigeonService } from '../../api/services/pigeonService'

/**
 * Composant Arbre généalogique
 * Affiche les parents et descendants d'un pigeon sélectionné
 */
function GenealogyTree() {
  const [selectedPigeonId, setSelectedPigeonId] = useState('')

  // Récupérer tous les pigeons
  const { data: pigeons = [], isLoading } = useQuery({
    queryKey: ['pigeons-tous'],
    queryFn: () => pigeonService.getTous()
  })

  const selectedPigeon = pigeons.find(p => p.id === parseInt(selectedPigeonId))

  // Récupérer les parents
  const pere = selectedPigeon?.pere_id 
    ? pigeons.find(p => p.id === selectedPigeon.pere_id)
    : null
  const mere = selectedPigeon?.mere_id
    ? pigeons.find(p => p.id === selectedPigeon.mere_id)
    : null

  // Récupérer les descendants (enfants)
  const descendants = pigeons.filter(
    p => p.pere_id === selectedPigeon?.id || p.mere_id === selectedPigeon?.id
  )

  // Séparer les descendants par sexe
  const fils = descendants.filter(d => d.sexe === 'male')
  const filles = descendants.filter(d => d.sexe === 'femelle')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="font-display text-3xl">Arbre généalogique</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualisez la lignée et les descendants de vos pigeons
          </p>
        </div>
      </div>

      {/* Sélecteur de pigeon */}
      <div className="">
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
          {pigeons.map(p => (
            <option key={p.id} value={p.id}>
              {p.bague} - {p.race}
            </option>
          ))}
        </select>
      </div>

      {/* Arbre généalogique */}
      {selectedPigeon ? (
        <div className="bg-card p-6 rounded-lg">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Parents */}
            <div className="grid grid-cols-2 gap-6">
              {/* Père */}
              <div className="text-center">
                <div className="text-xs font-medium text-muted-foreground uppercase mb-3 tracking-wider">
                  PÈRE
                </div>
                <ParentCard pigeon={pere} />
              </div>

              {/* Mère */}
              <div className="text-center">
                <div className="text-xs font-medium text-muted-foreground uppercase mb-3 tracking-wider">
                  MÈRE
                </div>
                <ParentCard pigeon={mere} />
              </div>
            </div>

            {/* Connecteur visuel */}
            <div className="flex justify-center">
              <GitBranch className="h-6 w-6 text-accent" />
            </div>

            {/* Pigeon sélectionné */}
            <div className="rounded-xl border border-accent bg-accent-foreground p-5 text-center">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Pigeon sélectionné</div>
              <div className="mt-1 font-display text-xl fond-semibold">{selectedPigeon.bague}</div>
              <div className="text-xs text-muted-foreground">{selectedPigeon.race} · {selectedPigeon.sexe === 'male' ? 'Mâle' : 'Femelle'}</div>
            </div>

            {/* Connecteur visuel vers descendants */}
            {descendants.length > 0 && (
              <div className="flex justify-center">
               <GitBranch className="h-6 w-6 text-accent" />
              </div>
            )}

            {/* Descendants */}
            {descendants.length > 0 && (
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Descendance ({descendants.length})
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {/* Fils */}
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-3 text-center tracking-wider">
                      FILS
                    </div>
                    <div className="space-y-3">
                      {fils.length > 0 ? (
                        fils.map(f => (
                          <DescendantCard
                            key={f.id}
                            pigeon={f}
                            onClick={() => setSelectedPigeonId(f.id.toString())}
                          />
                        ))
                      ) : (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                          Aucun fils
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Filles */}
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-3 text-center tracking-wider">
                      FILLE
                    </div>
                    <div className="space-y-3">
                      {filles.length > 0 ? (
                        filles.map(f => (
                          <DescendantCard
                            key={f.id}
                            pigeon={f}
                            onClick={() => setSelectedPigeonId(f.id.toString())}
                          />
                        ))
                      ) : (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                          Aucune fille
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow border border-border p-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Network className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Aucun pigeon sélectionné
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Sélectionnez un pigeon pour visualiser son arbre généalogique complet avec ses parents et descendants.
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Carte pour afficher un parent
 */
function ParentCard({ pigeon }) {
  if (!pigeon) {
    return (
      <div className="p-6 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <div className="text-2xl font-bold text-muted-foreground mb-1">—</div>
        <div className="text-sm text-muted-foreground">Inconnu</div>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
      <div className="text-xl font-bold text-foreground mb-1 font-mono">
        {pigeon.bague}
      </div>
      <div className="text-sm text-muted-foreground">
        {pigeon.race}
      </div>
    </div>
  )
}

/**
 * Carte pour afficher un descendant
 */
function DescendantCard({ pigeon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all text-center"
    >
      <div className="text-lg font-bold text-foreground mb-1 font-mono">
        {pigeon.bague}
      </div>
      <div className="text-xs text-muted-foreground">
        {pigeon.race}
      </div>
    </button>
  )
}

export default GenealogyTree