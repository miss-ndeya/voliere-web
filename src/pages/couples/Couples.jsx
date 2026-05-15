import { useState, useMemo } from 'react'
import { Plus, Heart, Bird } from 'lucide-react'
import { useCouples } from '../../hooks/useCouples'
import { CoupleCard } from '../../components/couples/CoupleCard'
import { CoupleFormModal } from '../../components/couples/CoupleFormModal'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import Button from '../../components/ui/Button'
import Message from '../../components/couples/Message'

function Couples() {
    const [showModal, setShowModal] = useState(false)
    const [showRompreModal, setShowRompreModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [coupleToRompre, setCoupleToRompre] = useState(null)
    const [coupleToDelete, setCoupleToDelete] = useState(null)
    const [coupleToEdit, setCoupleToEdit] = useState(null)
    const [activeTab, setActiveTab] = useState('actifs') // 'actifs' ou 'rompus'

    const { couples, isLoading, createCouple, updateCouple, rompreCouple, deleteCouple, isCreating, isUpdating, isRompre, isDeleting } = useCouples()

    // Séparer les couples actifs et rompus
    const couplesActifs = useMemo(() => {
        if (!couples) return []
        return couples.filter(c => c.actif)
    }, [couples])

    const couplesRompus = useMemo(() => {
        if (!couples) return []
        return couples.filter(c => !c.actif)
    }, [couples])

    // Afficher selon le tab actif
    const filteredCouples = useMemo(() => {
        return activeTab === 'actifs' ? couplesActifs : couplesRompus
    }, [couplesActifs, couplesRompus, activeTab])

    const handleEditClick = (couple) => {
        setCoupleToEdit(couple)
        setShowModal(true)
    }

    const handleRompreClick = (couple) => {
        setCoupleToRompre(couple)
        setShowRompreModal(true)
    }

    const handleRompreConfirm = async () => {
        if (coupleToRompre) {
            try {
                await rompreCouple(coupleToRompre.id)
                // Fermer uniquement si succès
                setShowRompreModal(false)
                setCoupleToRompre(null)
            } catch (error) {
                // Le toast d'erreur est déjà affiché par le hook
                // Le modal reste ouvert
            }
        }
    }

    const handleDeleteClick = (couple) => {
        setCoupleToDelete(couple)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (coupleToDelete) {
            try {
                await deleteCouple(coupleToDelete.id)
                // Fermer uniquement si succès
                setShowDeleteModal(false)
                setCoupleToDelete(null)
            } catch (error) {
                // Le toast d'erreur est déjà affiché par le hook
                // Le modal reste ouvert
            }
        }
    }

    const handleSubmit = async (formData) => {
        try {
            if (coupleToEdit) {
                // Mode édition
                await updateCouple({ id: coupleToEdit.id, data: formData })
            } else {
                // Mode création
                await createCouple(formData)
            }
            // Fermer uniquement si succès
            setShowModal(false)
            setCoupleToEdit(null)
        } catch (error) {
            // Le toast d'erreur est déjà affiché par le hook
            // Le modal reste ouvert pour que l'utilisateur puisse corriger
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
                        <p className="text-sm text-muted-foreground">
                            {couplesActifs.length} couple{couplesActifs.length > 1 ? 's' : ''} actif{couplesActifs.length > 1 ? 's' : ''} · {couplesRompus.length} rompu{couplesRompus.length > 1 ? 's' : ''}
                        </p>
                    </div>
                    <Button onClick={() => setShowModal(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Former un couple
                    </Button>
                </div>

                {/* Tabs - Style amélioré */}
                <div className="inline-flex bg-muted/30 rounded-lg p-1 gap-1">
                    <button
                        onClick={() => setActiveTab('actifs')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            activeTab === 'actifs'
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Actifs ({couplesActifs.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('rompus')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            activeTab === 'rompus'
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Rompus ({couplesRompus.length})
                    </button>
                </div>

                {/* Grid de cards */}
                {filteredCouples.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCouples.map((couple) => (
                            <CoupleCard
                                key={couple.id}
                                couple={couple}
                                onEdit={handleEditClick}
                                onRompre={handleRompreClick}
                            />
                        ))}
                    </div>
                ) : (
                   <Message setShowModal={setShowModal} activeTab={activeTab} />
                )}
            </div>

            {/* Modal de formulaire */}
            <CoupleFormModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                    setCoupleToEdit(null)
                }}
                couple={coupleToEdit}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
            />

            {/* Modal de confirmation de rupture */}
            <ConfirmModal
                isOpen={showRompreModal}
                onClose={() => {
                    setShowRompreModal(false)
                    setCoupleToRompre(null)
                }}
                onConfirm={handleRompreConfirm}
                title="Rompre le couple"
                message={`Êtes-vous sûr de vouloir rompre le couple ${coupleToRompre?.male?.bague} × ${coupleToRompre?.femelle?.bague} ? Les deux pigeons redeviendront disponibles.`}
                confirmText="Rompre"
                cancelText="Annuler"
                variant="destructive"
                isLoading={isRompre}
            />

             {/* Modal de confirmation de suppression */}
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false)
                        setCoupleToDelete(null)
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Supprimer le couple"
                    message={`Êtes-vous sûr de vouloir supprimer définitivement le couple ${coupleToDelete?.male?.bague} × ${coupleToDelete?.femelle?.bague} ? Cette action est irréversible.`}
                    confirmText="Supprimer"
                    cancelText="Annuler"
                    variant="destructive"
                    isLoading={isDeleting}
                />
        </>
    )
}

export default Couples