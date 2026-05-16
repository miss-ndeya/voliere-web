import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Modal } from '../ui/Modal'
import Button from '../ui/Button'
import { pigeonService } from '../../api/services/pigeonService'
import { cageService } from '../../api/services/cageService'
import { CageSelectField } from '../cages/CageSelectField'

export function CoupleFormModal({ isOpen, onClose, couple, onSubmit, isLoading }) {
    const [formData, setFormData] = useState({
        male_id: '',
        femelle_id: '',
        date_formation: new Date().toISOString().split('T')[0],
        cage_id: ''
    })

    const [errors, setErrors] = useState({})

    const { data: pigeonsDisponibles } = useQuery({
        queryKey: couple ? ['pigeons'] : ['pigeons-disponibles'],
        queryFn: () => (couple ? pigeonService.getAll() : pigeonService.getDisponibles()),
        enabled: isOpen
    })

    const { data: cages } = useQuery({
        queryKey: ['cages'],
        queryFn: () => cageService.getAll(),
        enabled: isOpen && !couple
    })

    const males = useMemo(() => {
        if (!pigeonsDisponibles) return []
        if (couple) {
            return pigeonsDisponibles.filter((p) => p.sexe === 'male' && p.statut === 'actif')
        }
        return pigeonsDisponibles.filter((p) => p.sexe === 'male')
    }, [pigeonsDisponibles, couple])

    const femelles = useMemo(() => {
        if (!pigeonsDisponibles) return []
        if (couple) {
            return pigeonsDisponibles.filter((p) => p.sexe === 'femelle' && p.statut === 'actif')
        }
        return pigeonsDisponibles.filter((p) => p.sexe === 'femelle')
    }, [pigeonsDisponibles, couple])

    const cagesPourCouple = useMemo(() => {
        if (!cages || couple) return []
        const maleId = parseInt(formData.male_id, 10)
        const femId = parseInt(formData.femelle_id, 10)
        return cages.filter((c) => {
            if (c.statut === 'libre') return true
            if (c.statut === 'occupe' && c.pigeon_id) {
                return c.pigeon_id === maleId || c.pigeon_id === femId
            }
            return false
        })
    }, [cages, couple, formData.male_id, formData.femelle_id])

    useEffect(() => {
        if (couple) {
            const maleId = couple.male_id || couple.male?.id || ''
            const femelleId = couple.femelle_id || couple.femelle?.id || ''
            setFormData({
                male_id: String(maleId),
                femelle_id: String(femelleId),
                date_formation: couple.date_formation || '',
                cage_id: ''
            })
        } else {
            setFormData({
                male_id: '',
                femelle_id: '',
                date_formation: new Date().toISOString().split('T')[0],
                cage_id: ''
            })
        }
        setErrors({})
    }, [couple, isOpen])

    const validate = () => {
        const newErrors = {}
        if (!formData.male_id) newErrors.male_id = 'Le mâle est requis'
        if (!formData.femelle_id) newErrors.femelle_id = 'La femelle est requise'
        if (!formData.date_formation) newErrors.date_formation = 'La date de formation est requise'
        if (formData.male_id === formData.femelle_id) {
            newErrors.femelle_id = 'Le mâle et la femelle doivent être différents'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        const payload = { ...formData }
        if (!payload.cage_id) delete payload.cage_id
        await onSubmit(payload)
    }

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={couple ? 'Modifier le couple' : 'Former un nouveau couple'}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                <div>
                    <label htmlFor="male_id" className="block text-sm font-medium text-foreground mb-2">
                        Mâle <span className="text-destructive">*</span>
                    </label>
                    <select
                        id="male_id"
                        value={formData.male_id}
                        onChange={(e) => handleChange('male_id', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${
                            errors.male_id ? 'border-destructive' : 'border-input'
                        }`}
                    >
                        <option value="">Choisir un mâle...</option>
                        {males.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.bague} — {p.race}
                                {couple && p.id === couple.male?.id ? ' (actuel)' : ''}
                            </option>
                        ))}
                    </select>
                    {errors.male_id && <p className="text-destructive text-xs mt-1">{errors.male_id}</p>}
                    {males.length === 0 && (
                        <p className="text-muted-foreground text-xs mt-1">Aucun mâle actif disponible</p>
                    )}
                </div>

                <div>
                    <label htmlFor="femelle_id" className="block text-sm font-medium text-foreground mb-2">
                        Femelle <span className="text-destructive">*</span>
                    </label>
                    <select
                        id="femelle_id"
                        value={formData.femelle_id}
                        onChange={(e) => handleChange('femelle_id', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${
                            errors.femelle_id ? 'border-destructive' : 'border-input'
                        }`}
                    >
                        <option value="">Choisir une femelle...</option>
                        {femelles.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.bague} — {p.race}
                                {couple && p.id === couple.femelle?.id ? ' (actuelle)' : ''}
                            </option>
                        ))}
                    </select>
                    {errors.femelle_id && <p className="text-destructive text-xs mt-1">{errors.femelle_id}</p>}
                    {femelles.length === 0 && (
                        <p className="text-muted-foreground text-xs mt-1">Aucune femelle active disponible</p>
                    )}
                </div>

                <div>
                    <label htmlFor="date_formation" className="block text-sm font-medium text-foreground mb-2">
                        Date de formation <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="date_formation"
                        type="date"
                        value={formData.date_formation}
                        onChange={(e) => handleChange('date_formation', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${
                            errors.date_formation ? 'border-destructive' : 'border-input'
                        }`}
                    />
                    {errors.date_formation && (
                        <p className="text-destructive text-xs mt-1">{errors.date_formation}</p>
                    )}
                </div>

                {!couple && formData.male_id && formData.femelle_id && (
                    <CageSelectField
                        label="Cage de reproduction (optionnel)"
                        value={formData.cage_id}
                        onChange={(v) => handleChange('cage_id', v)}
                        cages={cagesPourCouple}
                        disabled={isLoading || cagesPourCouple.length === 0}
                        hint="Choisissez une cage libre ou celle où un des deux partenaires est déjà seul — ils seront regroupés."
                    />
                )}

                <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                        {isLoading ? (couple ? 'Modification...' : 'Création...') : (couple ? 'Modifier' : 'Former le couple')}
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                        Annuler
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
