import { useState, useMemo, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { VoliereHeader, CageGridContainer, CageDetailPanel } from '../../components/voliere'
import { VoliereSkeleton } from '../../components/skeletons'
import { CageFormModal } from '../../components/cages/CageFormModal'
import { useToast } from '../../context/ToastContext'
import { useCages } from '../../hooks/useCages'
import Button from '../../components/ui/Button'
import api from '../../api/axios'
import { cageService } from '../../api/services/cageService'

function Visualisation() {
    const queryClient = useQueryClient()
    const { showToast } = useToast()
    const [selectedCage, setSelectedCage] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [filter, setFilter] = useState('all')
    const [query, setQuery] = useState('')

    // Utiliser le hook useCages pour créer une cage
    const { createCage, isCreating } = useCages()

    // Récupérer TOUTES les cages une seule fois (pas de refetch sur filtre)
    const { data: allCages, isLoading } = useQuery({
        queryKey: ['cages-visualisation'],
        queryFn: () => api.get('/cages-visualisation').then(res => res.data),
        staleTime: 30000,
        refetchInterval: 60000
    })

    const { data: pigeons } = useQuery({
        queryKey: ['pigeons'],
        queryFn: () => api.get('/pigeons').then(res => res.data),
        staleTime: 30000
    })

    const { data: couples } = useQuery({
        queryKey: ['couples'],
        queryFn: () => api.get('/couples').then(res => res.data),
        staleTime: 30000
    })

    const { data: reproductions = [] } = useQuery({
        queryKey: ['reproductions'],
        queryFn: () => api.get('/reproductions').then(res => res.data),
        staleTime: 30000
    })

    // Mettre à jour selectedCage quand les données changent
    useEffect(() => {
        if (selectedCage && allCages?.data) {
            const updatedCage = allCages.data.find(c => c.id === selectedCage.id)
            if (updatedCage) {
                setSelectedCage(updatedCage)
            }
        }
    }, [allCages, selectedCage?.id])

    // Filtrage côté client (pas de refetch)
    const filteredCages = useMemo(() => {
        if (!allCages?.data) return []
        
        let result = allCages.data

        // Filtre par statut
        if (filter !== 'all') {
            const statusMap = {
                'empty': 'libre',
                'pigeon': 'occupe',
                'couple': 'couple'
            }
            result = result.filter(c => c.statut === statusMap[filter])
        }

        // Recherche
        if (query.trim()) {
            const q = query.trim().toLowerCase()
            result = result.filter(c => {
                return c.numero.toLowerCase().includes(q) ||
                       c.nom?.toLowerCase().includes(q) ||
                       c.occupants?.pigeon?.bague?.toLowerCase().includes(q) ||
                       c.occupants?.male?.bague?.toLowerCase().includes(q) ||
                       c.occupants?.femelle?.bague?.toLowerCase().includes(q)
            })
        }

        return result
    }, [allCages, filter, query])

    // Compteurs
    const counts = useMemo(() => ({
        free: allCages?.data?.filter(c => c.statut === 'libre').length || 0,
        single: allCages?.data?.filter(c => c.statut === 'occupe').length || 0,
        couple: allCages?.data?.filter(c => c.statut === 'couple').length || 0,
    }), [allCages])

    // Pigeons sans cage ET sans couple actif
    const pigeonsSansCage = useMemo(() => {
        if (!pigeons || !allCages?.data || !couples) return []
        
        return pigeons.filter(p => {
            // Le pigeon doit être actif
            if (p.statut !== 'actif') return false
            
            // Vérifier si le pigeon est dans une cage seul
            const estSeulDansCage = allCages.data.some(c => c.occupants?.pigeon?.id === p.id)
            if (estSeulDansCage) return false
            
            // Vérifier si le pigeon fait partie d'un couple dans une cage
            const estEnCoupleDansCage = allCages.data.some(c => 
                c.occupants?.male?.id === p.id || c.occupants?.femelle?.id === p.id
            )
            if (estEnCoupleDansCage) return false
            
            // Vérifier si le pigeon fait partie d'un couple actif (même sans cage)
            const estEnCoupleActif = couples.some(c => 
                c.actif && (c.male_id === p.id || c.femelle_id === p.id)
            )
            if (estEnCoupleActif) return false
            
            return true
        })
    }, [pigeons, allCages, couples])

    // Couples sans cage
    const couplesSansCage = useMemo(() =>
        couples?.filter(c => c.actif && !allCages?.data?.find(cage => cage.occupants?.male?.id === c.male_id)) || []
    , [couples, allCages])

    // Mutations
    const affecter = useMutation({
        mutationFn: ({ cageId, type, id }) => cageService.affecter(cageId, { type, id }),
        onSuccess: () => {
            queryClient.invalidateQueries(['cages-visualisation'])
            queryClient.invalidateQueries(['pigeons'])
            queryClient.invalidateQueries(['couples'])
            showToast('Affectation réussie !', 'success')
        },
        onError: (error) => {
            showToast(error.response?.data?.message || 'Erreur lors de l\'affectation', 'error')
        }
    })

    const liberer = useMutation({
        mutationFn: (cageId) => cageService.liberer(cageId),
        onSuccess: () => {
            queryClient.invalidateQueries(['cages-visualisation'])
            queryClient.invalidateQueries(['pigeons'])
            queryClient.invalidateQueries(['couples'])
            showToast('Cage libérée !', 'success')
        },
        onError: (error) => {
            showToast(error.response?.data?.message || 'Erreur lors de la libération', 'error')
        }
    })

    // Handlers
    const handleAffecter = (cageId, type, id) => {
        affecter.mutate({ cageId, type, id })
    }

    const handleLiberer = (cageId) => {
        liberer.mutate(cageId)
    }

    const handleResetFilters = () => {
        setQuery('')
        setFilter('all')
    }

    const handleAddCage = async (formData) => {
        try {
            await createCage(formData)
            setShowAddModal(false)
        } catch (error) {
            // Le toast d'erreur est déjà affiché par le hook
            // Le modal reste ouvert
        }
    }

    // Loading skeleton
    if (isLoading) {
        return <VoliereSkeleton />
    }

    return (
        <>
        <div className="space-y-4 sm:space-y-6">
            {/* Header avec filtres */}
            <VoliereHeader
                filter={filter}
                setFilter={setFilter}
                query={query}
                setQuery={setQuery}
                counts={{ 
                    free: counts.free,
                    single: counts.single,
                    couple: counts.couple,
                    filtered: filteredCages.length
                }}
                showResultCount={query.length > 0}
                onAddCage={() => setShowAddModal(true)}
            />

            {/* Layout flex: Grille + Sidebar */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* Grille (pousse quand sidebar ouvert) */}
                <div className="flex-1 min-w-0">
                    <CageGridContainer
                        cages={filteredCages}
                        selectedId={selectedCage?.id}
                        onSelectCage={setSelectedCage}
                        query={query}
                        filter={filter}
                        onResetFilters={handleResetFilters}
                    />
                </div>

                {/* Sidebar (pousse le contenu) */}
                {selectedCage && (
                    <CageDetailPanel
                        cage={selectedCage}
                        onClose={() => setSelectedCage(null)}
                        pigeonsSansCage={pigeonsSansCage}
                        couplesSansCage={couplesSansCage}
                        pigeons={pigeons}
                        couples={couples}
                        reproductions={reproductions}
                        onAffecter={handleAffecter}
                        onLiberer={handleLiberer}
                        isLoading={affecter.isPending || liberer.isPending}
                    />
                )}
            </div>
        </div>

            <CageFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddCage}
                isLoading={isCreating}
            />
        </>
    )
}

export default Visualisation
