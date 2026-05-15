import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePigeons } from '../../hooks/usePigeons'
import { PigeonFormModal } from '../../components/pigeons/PigeonFormModal'
import { PigeonFilters } from '../../components/pigeons/PigeonFilters'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { DataTable } from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import { columns } from '../../utils/pigeons'
import { renderRow } from '../../components/pigeons/RenderRow'

function Pigeons() {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [pigeonEdit, setPigeonEdit] = useState(null)
    const [pigeonToDelete, setPigeonToDelete] = useState(null)
    const [filters, setFilters] = useState({
        search: '',
        sexe: 'tous',
        statut: 'actif'
    })

    // Utiliser le hook usePigeons
    const {
        pigeons,
        isLoading,
        createPigeon,
        updatePigeon,
        deletePigeon,
        isCreating,
        isUpdating,
        isDeleting
    } = usePigeons()

    // Filtrage côté client
    const filteredPigeons = useMemo(() => {
        if (!pigeons) return []

        return pigeons.filter(pigeon => {
            // Filtre par recherche (bague ou race)
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                const matchBague = pigeon.bague?.toLowerCase().includes(searchLower)
                const matchRace = pigeon.race?.toLowerCase().includes(searchLower)
                if (!matchBague && !matchRace) return false
            }

            // Filtre par sexe
            if (filters.sexe !== 'tous' && pigeon.sexe !== filters.sexe) {
                return false
            }

            // Filtre par statut
            if (filters.statut !== 'tous' && pigeon.statut !== filters.statut) {
                return false
            }

            return true
        })
    }, [pigeons, filters])

    const handleResetFilters = () => {
        setFilters({
            search: '',
            sexe: 'tous',
            statut: 'actif' // Remettre sur "actif" par défaut
        })
    }

    const handleEdit = (pigeon) => {
        setPigeonEdit(pigeon)
        setShowModal(true)
    }

    const handleDeleteClick = (pigeon) => {
        setPigeonToDelete(pigeon)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (pigeonToDelete) {
            try {
                await deletePigeon(pigeonToDelete.id)
                // Fermer uniquement si succès
                setShowDeleteModal(false)
                setPigeonToDelete(null)
            } catch (error) {
                // Le toast d'erreur est déjà affiché par le hook
                // Le modal reste ouvert
            }
        }
    }

    const handleSubmit = async (formData) => {
        try {
            if (pigeonEdit) {
                await updatePigeon({ id: pigeonEdit.id, data: formData })
            } else {
                await createPigeon(formData)
            }
            // Fermer uniquement si succès
            setShowModal(false)
            setPigeonEdit(null)
        } catch (error) {
            // Le toast d'erreur est déjà affiché par le hook
            // Le modal reste ouvert pour que l'utilisateur puisse corriger
        }
    }

    const renderPigeonsRow = (cage) => renderRow(cage, { navigate, handleEdit, handleDeleteClick, isDeleting })

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
                        <h1 className="font-display text-3xl">Pigeons</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {filteredPigeons.length} pigeon{filteredPigeons.length > 1 ? 's' : ''}
                            {pigeons && filteredPigeons.length !== pigeons.length && ` sur ${pigeons.length}`}
                        </p>
                    </div>
                    <Button onClick={() => setShowModal(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Ajouter un pigeon
                    </Button>
                </div>

                {/* Filtres */}
                <PigeonFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={handleResetFilters}
                />

                {/* Tableau des pigeons */}
                <DataTable
                    columns={columns}
                    data={filteredPigeons}
                    emptyMessage={
                        pigeons?.length > 0
                            ? "Aucun pigeon ne correspond aux filtres sélectionnés."
                            : "Aucun pigeon enregistré. Cliquez sur 'Ajouter un pigeon' pour commencer."
                    }
                    renderRow={renderPigeonsRow}
                />
            </div>

            {/* Modal de formulaire */}
            <PigeonFormModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                    setPigeonEdit(null)
                }}
                pigeon={pigeonEdit}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
            />
            {/* Modal de confirmation de suppression */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setPigeonToDelete(null)
                }}
                onConfirm={handleDeleteConfirm}
                title="Supprimer le pigeon"
                message={`Êtes-vous sûr de vouloir supprimer le pigeon ${pigeonToDelete?.bague} ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="destructive"
                isLoading={isDeleting}
            />
        </>
    )
}

export default Pigeons
