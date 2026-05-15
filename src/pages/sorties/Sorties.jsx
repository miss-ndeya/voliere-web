import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useSorties } from '../../hooks/useSorties'
import { SortieFormModal } from '../../components/sorties/SortieFormModal'
import { SortieFilters } from '../../components/sorties/SortieFilters'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { DataTable } from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'

function Sorties() {
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [sortieEdit, setSortieEdit] = useState(null)
    const [sortieToDelete, setSortieToDelete] = useState(null)

    // État des filtres
    const [filters, setFilters] = useState({
        search: '',
        type: 'tous',
        mois: 'tous',
        annee: 'tous'
    })

    const {
        sorties,
        isLoading,
        createSortie,
        updateSortie,
        deleteSortie,
        isCreating,
        isUpdating,
        isDeleting
    } = useSorties()

    // Filtrage côté client
    const filteredSorties = useMemo(() => {
        if (!sorties) return []

        return sorties.filter(sortie => {
            // Filtre par recherche (bague du pigeon ou acheteur)
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                const matchBague = sortie.pigeon?.bague?.toLowerCase().includes(searchLower)
                const matchAcheteur = sortie.acheteur?.toLowerCase().includes(searchLower)
                if (!matchBague && !matchAcheteur) return false
            }

            // Filtre par type
            if (filters.type !== 'tous' && sortie.type !== filters.type) {
                return false
            }

            // Filtre par mois
            if (filters.mois !== 'tous') {
                const sortieMois = sortie.date_sortie.substring(5, 7) // Extrait MM de YYYY-MM-DD
                if (sortieMois !== filters.mois) return false
            }

            // Filtre par année
            if (filters.annee !== 'tous') {
                const sortieAnnee = sortie.date_sortie.substring(0, 4) // Extrait YYYY de YYYY-MM-DD
                if (sortieAnnee !== filters.annee) return false
            }

            return true
        })
    }, [sorties, filters])

    const handleResetFilters = () => {
        setFilters({
            search: '',
            type: 'tous',
            mois: 'tous',
            annee: 'tous'
        })
    }

    const handleEdit = (sortie) => {
        setSortieEdit(sortie)
        setShowModal(true)
    }

    const handleDeleteClick = (sortie) => {
        setSortieToDelete(sortie)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (sortieToDelete) {
            try {
                await deleteSortie(sortieToDelete.id)
                setShowDeleteModal(false)
                setSortieToDelete(null)
            } catch (error) {
                // Le toast d'erreur est déjà affiché par le hook
            }
        }
    }

    const handleSubmit = async (formData) => {
        try {
            if (sortieEdit) {
                await updateSortie({ id: sortieEdit.id, data: formData })
            } else {
                await createSortie(formData)
            }
            setShowModal(false)
            setSortieEdit(null)
        } catch (error) {
            // Le toast d'erreur est déjà affiché par le hook
            // Ne pas fermer le modal pour permettre la correction
        }
    }

    // Configuration des colonnes du tableau
    const columns = [
        { header: 'Pigeon' },
        { header: 'Type', className: 'hidden sm:table-cell' },
        { header: 'Date', className: 'hidden md:table-cell' },
        { header: 'Détails', className: 'hidden lg:table-cell' },
        { header: 'Actions' },
    ]

    const renderRow = (sortie) => (
        <tr key={sortie.id} className="border-b border-border hover:bg-muted/50 transition-colors">
            <td className="p-2 sm:p-3 font-medium text-foreground">
                <div>
                    <div>{sortie.pigeon?.bague}</div>
                    <div className="text-xs text-muted-foreground sm:hidden">
                        {sortie.type === 'vente' ? 'Vente' : sortie.type === 'deces' ? 'Décès' : 'Perte'}
                        {' · '}
                        {new Date(sortie.date_sortie).toLocaleDateString('fr-FR')}
                    </div>
                </div>
            </td>
            <td className="hidden sm:table-cell p-2 sm:p-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${sortie.type === 'vente'
                        ? 'bg-cage-single-soft text-cage-single-foreground'
                        : sortie.type === 'deces'
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-destructive/10 text-destructive'
                    }`}>
                    {sortie.type === 'vente' ? 'Vente' : sortie.type === 'deces' ? 'Décès' : 'Perte'}
                </span>
            </td>
            <td className="hidden md:table-cell p-2 sm:p-3 text-muted-foreground">
                {new Date(sortie.date_sortie).toLocaleDateString('fr-FR')}
            </td>
            <td className="hidden lg:table-cell p-2 sm:p-3 text-muted-foreground text-sm">
                {sortie.type === 'vente' && (
                    <div>
                        {sortie.acheteur && <div>Acheteur: {sortie.acheteur}</div>}
                        {sortie.prix && <div className="font-medium text-foreground">{sortie.prix} FCFA</div>}
                    </div>
                )}
                {sortie.type === 'deces' && (sortie.cause || '-')}
                {sortie.type === 'perte' && (sortie.circonstance || '-')}
            </td>
            <td className="p-2 sm:p-3">
                <div className="flex gap-1 sm:gap-2">
                    <button
                        onClick={() => handleEdit(sortie)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Modifier"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(sortie)}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                        title="Supprimer"
                        disabled={isDeleting}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Chargement...</p>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl">Sorties</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {filteredSorties.length} sortie{filteredSorties.length > 1 ? 's' : ''}
                            {sorties && filteredSorties.length !== sorties.length && ` sur ${sorties.length}`}
                        </p>
                    </div>
                    <Button onClick={() => setShowModal(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Enregistrer une sortie
                    </Button>
                </div>

                {/* Filtres */}
                <SortieFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={handleResetFilters}
                />

                {/* Tableau des sorties */}
                <DataTable
                    columns={columns}
                    data={filteredSorties}
                    emptyMessage={
                        sorties?.length > 0
                            ? "Aucune sortie ne correspond aux filtres sélectionnés."
                            : "Aucune sortie enregistrée. Cliquez sur 'Enregistrer une sortie' pour commencer."
                    }
                    renderRow={renderRow}
                />
            </div>

            {/* Modal de formulaire */}
            <SortieFormModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                    setSortieEdit(null)
                }}
                sortie={sortieEdit}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
            />

            {/* Modal de confirmation de suppression */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setSortieToDelete(null)
                }}
                onConfirm={handleDeleteConfirm}
                title="Supprimer la sortie"
                message={`Êtes-vous sûr de vouloir supprimer cette sortie ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="destructive"
                isLoading={isDeleting}
            />
        </>
    )
}

export default Sorties
