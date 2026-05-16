import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Modal } from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { coupleService } from '../../api/services/coupleService'
import { reproductionService } from '../../api/services/reproductionService'
import { filterCouplesPourNouvelleReproduction } from '../../utils/reproductionWorkflow'

export function ReproductionFormModal({ isOpen, onClose, reproduction, onSubmit, isLoading }) {
    const [formData, setFormData] = useState({
        couple_id: '',
        date_ponte: '',
        date_eclosion: '',
        nb_jeunes: '0'
    })

    const [errors, setErrors] = useState({})

    // Récupérer les couples actifs
    const { data: couples } = useQuery({
        queryKey: ['couples'],
        queryFn: () => coupleService.getAll(),
        enabled: isOpen
    })

    const { data: reproductions } = useQuery({
        queryKey: ['reproductions'],
        queryFn: () => reproductionService.getAll(),
        enabled: isOpen
    })

    const couplesEligibles = filterCouplesPourNouvelleReproduction(couples, reproductions, reproduction)

    useEffect(() => {
        if (reproduction) {
            // Mode édition
            setFormData({
                couple_id: reproduction.couple_id || '',
                date_ponte: reproduction.date_ponte || '',
                date_eclosion: reproduction.date_eclosion || '',
                nb_jeunes: reproduction.nb_jeunes || ''
            })
        } else {
            // Mode création
            setFormData({
                couple_id: '',
                date_ponte: '',
                date_eclosion: '',
                nb_jeunes: '0'
            })
        }
        setErrors({})
    }, [reproduction, isOpen])

    const validate = () => {
        const newErrors = {}

        if (!formData.couple_id) {
            newErrors.couple_id = 'Le couple est requis'
        }

        if (!formData.date_ponte) {
            newErrors.date_ponte = 'La date de ponte est requise'
        }

        if (formData.nb_jeunes === '' || parseInt(formData.nb_jeunes, 10) < 0) {
            newErrors.nb_jeunes = 'Indiquez le nombre de jeunes (0 à 2)'
        }

        if (parseInt(formData.nb_jeunes) > 2) {
            newErrors.nb_jeunes = 'Le nombre de jeunes ne peut pas dépasser 2'
        }

        // Vérifier que la date d'éclosion est après la date de ponte
        if (formData.date_eclosion && formData.date_ponte) {
            const datePonte = new Date(formData.date_ponte)
            const dateEclosion = new Date(formData.date_eclosion)
            const diffDays = Math.floor((dateEclosion - datePonte) / (1000 * 60 * 60 * 24))

            if (diffDays < 17) {
                newErrors.date_eclosion = 'La date d\'éclosion doit être au minimum 17 jours après la date de ponte'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validate()) return

        try {
            await onSubmit(formData)
        } catch (error) {
            // Les erreurs sont gérées par le hook
        }
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={reproduction ? 'Modifier la reproduction' : 'Nouvelle reproduction'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                {/* Couple */}
                <div>
                    <label htmlFor="couple_id" className="block text-sm font-medium text-foreground mb-2">
                        Couple <span className="text-destructive">*</span>
                    </label>
                    <select
                        id="couple_id"
                        value={formData.couple_id}
                        onChange={(e) => handleChange('couple_id', e.target.value)}
                        disabled={!!reproduction} // Ne pas permettre de changer le couple en édition
                        className={`w-full border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${
                            errors.couple_id ? 'border-destructive' : 'border-input'
                        } ${reproduction ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <option value="">Choisir un couple...</option>
                        {couplesEligibles.map(c => (
                            <option key={c.id} value={c.id}>
                                ♂ {c.male?.bague} × ♀ {c.femelle?.bague}
                            </option>
                        ))}
                    </select>
                    {errors.couple_id && (
                        <p className="text-destructive text-xs mt-1">{errors.couple_id}</p>
                    )}
                    {!reproduction && couplesEligibles.length === 0 && (
                        <p className="text-muted-foreground text-xs mt-1">
                            Aucun couple disponible : chaque couple actif a déjà une couvée en cours.
                        </p>
                    )}
                    <p className="text-muted-foreground text-xs mt-1">
                        Un seul suivi de couvée à la fois par couple. Mettez 0 jeune si la couvée est vide.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Date de ponte */}
                    <div>
                        <label htmlFor="date_ponte" className="block text-sm font-medium text-foreground mb-2">
                            Date de ponte <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="date_ponte"
                            type="date"
                            value={formData.date_ponte}
                            onChange={(e) => handleChange('date_ponte', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className={errors.date_ponte ? 'border-destructive' : ''}
                        />
                        {errors.date_ponte && (
                            <p className="text-destructive text-xs mt-1">{errors.date_ponte}</p>
                        )}
                    </div>

                    {/* Date d'éclosion */}
                    <div>
                        <label htmlFor="date_eclosion" className="block text-sm font-medium text-foreground mb-2">
                            Date d'éclosion
                        </label>
                        <Input
                            id="date_eclosion"
                            type="date"
                            value={formData.date_eclosion}
                            onChange={(e) => handleChange('date_eclosion', e.target.value)}
                            min={formData.date_ponte || undefined}
                            className={errors.date_eclosion ? 'border-destructive' : ''}
                        />
                        {errors.date_eclosion && (
                            <p className="text-destructive text-xs mt-1">{errors.date_eclosion}</p>
                        )}
                        <p className="text-muted-foreground text-xs mt-1">Minimum 17 jours après la ponte</p>
                    </div>
                </div>

                {/* Nombre de jeunes */}
                <div>
                    <label htmlFor="nb_jeunes" className="block text-sm font-medium text-foreground mb-2">
                        Nombre de jeunes <span className="text-destructive">*</span>
                    </label>
                    <Input
                        id="nb_jeunes"
                        type="number"
                        min="0"
                        max="2"
                        value={formData.nb_jeunes}
                        onChange={(e) => handleChange('nb_jeunes', e.target.value)}
                        placeholder="0"
                        className={errors.nb_jeunes ? 'border-destructive' : ''}
                    />
                    {errors.nb_jeunes && (
                        <p className="text-destructive text-xs mt-1">{errors.nb_jeunes}</p>
                    )}
                    <p className="text-muted-foreground text-xs mt-1">De 0 à 2 jeunes par reproduction</p>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className=""
                    >
                        {isLoading ? (reproduction ? 'Modification...' : 'Enregistrement...') : (reproduction ? 'Modifier' : 'Enregistrer')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
