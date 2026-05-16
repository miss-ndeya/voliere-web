import { useState, useMemo } from 'react'
import { Plus, Egg } from 'lucide-react'
import { useReproductions } from '../../hooks/useReproductions'
import { isEnCours, isABaguer, isTerminee } from '../../utils/reproductionWorkflow'
import { ReproductionCard } from '../../components/reproductions/ReproductionCard'
import { ReproductionFormModal } from '../../components/reproductions/ReproductionFormModal'
import { PigeonneauxFormModal } from '../../components/reproductions/PigeonneauxFormModal'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import Button from '../../components/ui/Button'

function Reproductions() {
    const [showModal, setShowModal] = useState(false)
    const [showPigeonneauxModal, setShowPigeonneauxModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [reproductionEdit, setReproductionEdit] = useState(null)
    const [reproductionForPigeonneaux, setReproductionForPigeonneaux] = useState(null)
    const [reproductionToDelete, setReproductionToDelete] = useState(null)
    const [activeTab, setActiveTab] = useState('en-cours')

    const {
        reproductions,
        isLoading,
        createReproduction,
        updateReproduction,
        deleteReproduction,
        createPigeonneaux,
        isCreating,
        isUpdating,
        isDeleting,
        isCreatingPigeonneaux
    } = useReproductions()

    const reproductionsEnCours = useMemo(() => {
        if (!reproductions) return []
        return reproductions.filter((r) => isEnCours(r.statut))
    }, [reproductions])

    const reproductionsABaguer = useMemo(() => {
        if (!reproductions) return []
        return reproductions.filter((r) => isABaguer(r.statut))
    }, [reproductions])

    const reproductionsTerminees = useMemo(() => {
        if (!reproductions) return []
        return reproductions.filter((r) => isTerminee(r.statut))
    }, [reproductions])

    const filteredReproductions = useMemo(() => {
        if (activeTab === 'en-cours') return reproductionsEnCours
        if (activeTab === 'a-baguer') return reproductionsABaguer
        return reproductionsTerminees
    }, [activeTab, reproductionsEnCours, reproductionsABaguer, reproductionsTerminees])

    const handleEdit = (reproduction) => {
        setReproductionEdit(reproduction)
        setShowModal(true)
    }

    const handleDeleteClick = (reproduction) => {
        setReproductionToDelete(reproduction)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (reproductionToDelete) {
            try {
                await deleteReproduction(reproductionToDelete.id)
                setShowDeleteModal(false)
                setReproductionToDelete(null)
            } catch (error) {
                // Le toast d'erreur est déjà affiché par le hook
            }
        }
    }

    const handleCreatePigeonneaux = (reproduction) => {
        if (!reproduction.can_create_pigeonneaux) return
        setReproductionForPigeonneaux(reproduction)
        setShowPigeonneauxModal(true)
    }

    const handleSubmit = async (formData) => {
        try {
            if (reproductionEdit) {
                await updateReproduction({ id: reproductionEdit.id, data: formData })
            } else {
                await createReproduction(formData)
            }
            setShowModal(false)
            setReproductionEdit(null)
        } catch (error) {
            // Le toast d'erreur est déjà affiché par le hook
        }
    }

    const handleSubmitPigeonneaux = async (pigeonneaux) => {
        try {
            await createPigeonneaux({
                id: reproductionForPigeonneaux.id,
                pigeonneaux
            })
            setShowPigeonneauxModal(false)
            setReproductionForPigeonneaux(null)
        } catch (error) {
            // Le toast d'erreur est déjà affiché par le hook
        }
    }

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
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl">Reproductions</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {reproductionsEnCours.length} en cours · {reproductionsABaguer.length} à baguer · {reproductionsTerminees.length} terminée{reproductionsTerminees.length > 1 ? 's' : ''}
                        </p>
                    </div>
                    <Button onClick={() => setShowModal(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nouvelle reproduction
                    </Button>
                </div>

                {/* Onglets */}
                <div className="inline-flex flex-wrap bg-muted/30 rounded-lg p-1 gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('en-cours')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'en-cours'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        En cours ({reproductionsEnCours.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('a-baguer')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'a-baguer'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        À baguer ({reproductionsABaguer.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('terminees')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'terminees'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Terminées ({reproductionsTerminees.length})
                    </button>
                </div>

                {/* Grid de cards */}
                {filteredReproductions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredReproductions.map((reproduction) => (
                            <ReproductionCard
                                key={reproduction.id}
                                reproduction={reproduction}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                                onCreatePigeonneaux={handleCreatePigeonneaux}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-card rounded-lg shadow border border-border p-16 text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                                <Egg className="h-12 w-12 text-accent" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                            {activeTab === 'en-cours' && 'Aucune couvée en incubation'}
                            {activeTab === 'a-baguer' && 'Aucune couvée à baguer'}
                            {activeTab === 'terminees' && 'Aucune reproduction terminée'}
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8">
                            {activeTab === 'en-cours' && "Enregistrez une nouvelle ponte pour suivre l'incubation."}
                            {activeTab === 'a-baguer' && "Les couvées dont l'éclosion est passée et les jeunes déclarés apparaîtront ici."}
                            {activeTab === 'terminees' && "Les couvées clôturées (jeunes bagués ou couvée vide) sont listées ici."}
                        </p>
                        {activeTab === 'en-cours' && (
                            <Button onClick={() => setShowModal(true)} className="gap-2" size="lg">
                                <Plus className="h-5 w-5" />
                                Nouvelle reproduction
                            </Button>
                        )}
                    </div>
                )}
            </div>
            {/* Modal de formulaire */}
            <ReproductionFormModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                    setReproductionEdit(null)
                }}
                reproduction={reproductionEdit}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
            />
            {/* Modal de création de pigeonneaux */}
            <PigeonneauxFormModal
                isOpen={showPigeonneauxModal}
                onClose={() => {
                    setShowPigeonneauxModal(false)
                    setReproductionForPigeonneaux(null)
                }}
                reproduction={reproductionForPigeonneaux}
                onSubmit={handleSubmitPigeonneaux}
                isLoading={isCreatingPigeonneaux}
            />

            {/* Modal de confirmation de suppression */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setReproductionToDelete(null)
                }}
                onConfirm={handleDeleteConfirm}
                title="Supprimer la reproduction"
                message={`Êtes-vous sûr de vouloir supprimer cette reproduction ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="destructive"
                isLoading={isDeleting}
            />
        </>
    )
}

export default Reproductions
