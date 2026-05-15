import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCages } from '../../hooks/useCages'
import { CageFormModal } from '../../components/cages/CageFormModal'
import { CageFilters } from '../../components/cages/CageFilters'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { DataTable } from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import { columns } from '../../utils/cagesHelpers'
import { renderRow } from '../../components/cages/RenderRow'

function Cages() {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [cageEdit, setCageEdit] = useState(null)
    const [cageToDelete, setCageToDelete] = useState(null)

    // État des filtres
    const [filters, setFilters] = useState({
        search: '',
        statut: 'tous'
    })

    const { cages, isLoading, createCage, updateCage, deleteCage, isCreating, isUpdating, isDeleting } = useCages()

    // Filtrage côté client
    const filteredCages = useMemo(() => {
        if (!cages) return []

        return cages.filter(cage => {
            // Filtre par recherche (numéro ou nom)
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                const matchNumero = cage.numero?.toLowerCase().includes(searchLower)
                const matchNom = cage.nom?.toLowerCase().includes(searchLower)
                if (!matchNumero && !matchNom) return false
            }

            // Filtre par statut
            if (filters.statut !== 'tous' && cage.statut !== filters.statut) {
                return false
            }

            return true
        })
    }, [cages, filters])

    const handleResetFilters = () => {
        setFilters({
            search: '',
            statut: 'tous'
        })
    }

    const handleEdit = (cage) => {
        setCageEdit(cage)
        setShowModal(true)
    }

    const handleDeleteClick = (cage) => {
        setCageToDelete(cage)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (cageToDelete) {
            // Si la cage n'est pas libre, on ferme juste le modal (message informatif)
            if (cageToDelete.statut !== 'libre') {
                setShowDeleteModal(false)
                setCageToDelete(null)
                return
            }

            // Sinon on supprime
            try {
                await deleteCage(cageToDelete.id)
                setShowDeleteModal(false)
                setCageToDelete(null)
            } catch (error) {
                // Le toast d'erreur est déjà affiché par le hook
            }
        }
    }

    const handleSubmit = async (formData) => {
        try {
            if (cageEdit) {
                await updateCage({ id: cageEdit.id, data: formData })
            } else {
                await createCage(formData)
            }
            setShowModal(false)
            setCageEdit(null)
        } catch (error) {
            // Le toast d'erreur est déjà affiché par le hook
            // Ne pas fermer le modal pour permettre la correction
        }
    }

    // Wrapper pour renderRow avec les props nécessaires
    const renderCageRow = (cage) => renderRow(cage, { navigate, handleEdit, handleDeleteClick, isDeleting })

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
                        <h1 className="font-display text-3xl">Cages</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {filteredCages.length} cage{filteredCages.length > 1 ? 's' : ''}
                            {cages && filteredCages.length !== cages.length && ` sur ${cages.length}`}
                        </p>
                    </div>
                    <Button onClick={() => setShowModal(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Ajouter une cage
                    </Button>
                </div>

                {/* Filtres */}
                <CageFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={handleResetFilters}
                />

                {/* Tableau des cages */}
                <DataTable
                    columns={columns}
                    data={filteredCages}
                    emptyMessage={
                        cages?.length > 0
                            ? "Aucune cage ne correspond aux filtres sélectionnés."
                            : "Aucune cage enregistrée. Cliquez sur 'Ajouter une cage' pour commencer."
                    }
                    renderRow={renderCageRow}
                />
            </div>

            {/* Modal de formulaire */}
            <CageFormModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                    setCageEdit(null)
                }}
                cage={cageEdit}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
            />

            {/* Modal de confirmation de suppression */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setCageToDelete(null)
                }}
                onConfirm={handleDeleteConfirm}
                title="Supprimer la cage"
                message={
                    cageToDelete?.statut !== 'libre'
                        ? `La cage ${cageToDelete?.numero} est actuellement ${cageToDelete?.statut === 'occupe' ? 'occupée par un pigeon' : 'occupée par un couple'}. Vous devez d'abord la libérer avant de pouvoir la supprimer.`
                        : `Êtes-vous sûr de vouloir supprimer la cage ${cageToDelete?.numero} ? Cette action est irréversible.`
                }
                confirmText={cageToDelete?.statut !== 'libre' ? 'Compris' : 'Supprimer'}
                cancelText={cageToDelete?.statut !== 'libre' ? 'Annuler' : 'Annuler'}
                variant={cageToDelete?.statut !== 'libre' ? 'default' : 'destructive'}
                isLoading={isDeleting}
            />
        </>
    )
}

export default Cages