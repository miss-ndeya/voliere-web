import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePigeons } from '../../hooks/usePigeons'
import { useSorties } from '../../hooks/useSorties'
import { PigeonFormModal } from '../../components/pigeons/PigeonFormModal'
import { PigeonFilters } from '../../components/pigeons/PigeonFilters'
import { SortieFormModal } from '../../components/sorties/SortieFormModal'
import { DataTable } from '../../components/ui/DataTable'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import Button from '../../components/ui/Button'
import { columns } from '../../utils/pigeons'
import { renderRow } from '../../components/pigeons/RenderRow'

function Pigeons() {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [showSortieModal, setShowSortieModal] = useState(false)
    const [pigeonEdit, setPigeonEdit] = useState(null)
    const [pigeonForExit, setPigeonForExit] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
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

    // Utiliser le hook useSorties pour créer une sortie
    const {
        createSortie,
        isCreating: isCreatingSortie
    } = useSorties()

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

    const handleDeclareExit = (pigeon) => {
        setPigeonForExit(pigeon)
        setShowSortieModal(true)
    }

    const handleArchive = (pigeon) => {
        setPigeonToDelete(pigeon)
        setShowDeleteModal(true)
    }

    const handleConfirmArchive = async () => {
        if (!pigeonToDelete) return
        try {
            await deletePigeon(pigeonToDelete.id)
            setShowDeleteModal(false)
            setPigeonToDelete(null)
        } catch {
            // toast géré par le hook
        }
    }

    const handleSortieSubmit = async (formData) => {
        try {
            await createSortie(formData)
            // Fermer uniquement si succès
            setShowSortieModal(false)
            setPigeonForExit(null)
        } catch (error) {
            // Le toast d'erreur est déjà affiché par le hook
            // Le modal reste ouvert
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

    const renderPigeonsRow = (pigeon) => renderRow(pigeon, {
        navigate,
        handleEdit,
        handleDeclareExit,
        handleArchive,
        isDeleting
    })

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

            {/* Modal de déclaration de sortie */}
            <SortieFormModal
                isOpen={showSortieModal}
                onClose={() => {
                    setShowSortieModal(false)
                    setPigeonForExit(null)
                }}
                preselectedPigeonId={pigeonForExit?.id}
                onSubmit={handleSortieSubmit}
                isLoading={isCreatingSortie}
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setPigeonToDelete(null)
                }}
                onConfirm={handleConfirmArchive}
                title="Archiver le pigeon"
                message={`Êtes-vous sûr de vouloir archiver le pigeon ${pigeonToDelete?.bague} ? Le pigeon sera masqué mais restera consultable dans l'historique et l'arbre généalogique.`}
                confirmText="Archiver"
                isLoading={isDeleting}
            />
        </>
    )
}

export default Pigeons
