import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

/**
 * Modal de formulaire pour créer/modifier une cage
 */
export function CageFormModal({ isOpen, onClose, cage, onSubmit, isLoading }) {
    const [formData, setFormData] = useState({
        numero: '',
        nom: '',
        superficie: ''
    })

    const [errors, setErrors] = useState({})

    // Pré-remplir le formulaire en mode édition
    useEffect(() => {
        if (cage) {
            setFormData({
                numero: cage.numero || '',
                nom: cage.nom || '',
                superficie: cage.superficie || ''
            })
        } else {
            setFormData({
                numero: '',
                nom: '',
                superficie: ''
            })
        }
        setErrors({})
    }, [cage, isOpen])

    const validate = () => {
        const newErrors = {}

        if (!formData.numero.trim()) {
            newErrors.numero = 'Le numéro est requis'
        }

        if (!formData.nom.trim()) {
            newErrors.nom = 'Le nom est requis'
        }

        if (formData.superficie && isNaN(parseFloat(formData.superficie))) {
            newErrors.superficie = 'La superficie doit être un nombre'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validate()) return

        // Préparer les données
        const submitData = {
            numero: formData.numero.trim(),
            nom: formData.nom.trim(),
            superficie: formData.superficie ? parseFloat(formData.superficie) : null
        }

        await onSubmit(submitData)
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Effacer l'erreur du champ modifié
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={cage ? 'Modifier la cage' : 'Nouvelle cage'}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                {/* Numéro */}
                <div>
                    <label htmlFor="numero" className="block text-sm font-medium text-foreground mb-2">
                        Numéro <span className="text-destructive">*</span>
                    </label>
                    <Input
                        id="numero"
                        type="text"
                        value={formData.numero}
                        onChange={(e) => handleChange('numero', e.target.value)}
                        placeholder="ex: A01, B12..."
                        error={errors.numero}
                    />
                    {errors.numero && (
                        <p className="text-destructive text-xs mt-1">{errors.numero}</p>
                    )}
                </div>

                {/* Nom */}
                <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-foreground mb-2">
                        Nom <span className="text-destructive">*</span>
                    </label>
                    <Input
                        id="nom"
                        type="text"
                        value={formData.nom}
                        onChange={(e) => handleChange('nom', e.target.value)}
                        placeholder="ex: Cage principale, Nurserie..."
                        error={errors.nom}
                    />
                    {errors.nom && (
                        <p className="text-destructive text-xs mt-1">{errors.nom}</p>
                    )}
                </div>

                {/* Superficie */}
                <div>
                    <label htmlFor="superficie" className="block text-sm font-medium text-foreground mb-2">
                        Superficie (m²)
                    </label>
                    <Input
                        id="superficie"
                        type="number"
                        step="0.01"
                        value={formData.superficie}
                        onChange={(e) => handleChange('superficie', e.target.value)}
                        placeholder="ex: 2.5"
                        error={errors.superficie}
                    />
                    {errors.superficie && (
                        <p className="text-destructive text-xs mt-1">{errors.superficie}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
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
                        {isLoading ? 'Enregistrement...' : cage ? 'Modifier' : 'Créer'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
