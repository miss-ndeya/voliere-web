import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

/**
 * Modal pour créer les pigeonneaux d'une reproduction
 */
export function PigeonneauxFormModal({ isOpen, onClose, reproduction, onSubmit, isLoading }) {
    const [pigeonneaux, setPigeonneaux] = useState([])
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (isOpen && reproduction) {
            // Initialiser avec un pigeonneau vide
            setPigeonneaux([{ bague: '', sexe: '', race: reproduction.couple?.male?.race || '' }])
        } else {
            setPigeonneaux([])
        }
        setErrors({})
    }, [isOpen, reproduction])

    const maxJeunes = Math.min(2, reproduction?.nb_jeunes ?? 2)

    const ajouterPigeonneau = () => {
        if (pigeonneaux.length >= maxJeunes) return
        setPigeonneaux([...pigeonneaux, { 
            bague: '', 
            sexe: '', 
            race: reproduction?.couple?.male?.race || '' 
        }])
    }

    const supprimerPigeonneau = (index) => {
        setPigeonneaux(pigeonneaux.filter((_, i) => i !== index))
    }

    const handleChange = (index, field, value) => {
        const newPigeonneaux = [...pigeonneaux]
        newPigeonneaux[index][field] = value
        setPigeonneaux(newPigeonneaux)
        
        // Effacer l'erreur du champ modifié
        if (errors[`${index}.${field}`]) {
            const newErrors = { ...errors }
            delete newErrors[`${index}.${field}`]
            setErrors(newErrors)
        }
    }

    const validate = () => {
        const newErrors = {}

        pigeonneaux.forEach((p, index) => {
            if (!p.bague.trim()) {
                newErrors[`${index}.bague`] = 'La bague est requise'
            }
            if (!p.sexe) {
                newErrors[`${index}.sexe`] = 'Le sexe est requis'
            }
        })

        // Vérifier les bagues en double
        const bagues = pigeonneaux.map(p => p.bague.trim()).filter(b => b)
        const baquesUniques = new Set(bagues)
        if (bagues.length !== baquesUniques.size) {
            newErrors.general = 'Les numéros de bague doivent être uniques'
        }

        if (pigeonneaux.length > maxJeunes) {
            newErrors.general = `Maximum ${maxJeunes} pigeonneau(x) pour cette reproduction`
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validate()) return

        try {
            await onSubmit(pigeonneaux)
        } catch (error) {
            // Les erreurs sont gérées par le hook
        }
    }

    if (!reproduction) return null

    const placesDisponibles = maxJeunes
    const pigeonneauxExistants = reproduction.pigeonneaux?.length || 0
    const placesRestantes = Math.max(0, placesDisponibles - pigeonneauxExistants)

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Créer les pigeonneaux"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="p-6">
                {/* Info reproduction */}
                <div className="bg-muted/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">
                            ♂ {reproduction.couple?.male?.bague} × ♀ {reproduction.couple?.femelle?.bague}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Éclosion: {new Date(reproduction.date_eclosion).toLocaleDateString('fr-FR')}
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {placesRestantes} place{placesRestantes > 1 ? 's' : ''} disponible{placesRestantes > 1 ? 's' : ''} sur {placesDisponibles}
                    </div>
                </div>

                {errors.general && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
                        <p className="text-sm text-destructive">{errors.general}</p>
                    </div>
                )}

                {/* Liste des pigeonneaux */}
                <div className="flex flex-col gap-4 mb-6">
                    {pigeonneaux.map((pigeonneau, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-1 grid grid-cols-3 gap-3">
                                    {/* Bague */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Bague <span className="text-destructive">*</span>
                                        </label>
                                        <Input
                                            type="text"
                                            value={pigeonneau.bague}
                                            onChange={(e) => handleChange(index, 'bague', e.target.value)}
                                            placeholder="Ex: P2024-001"
                                            className={errors[`${index}.bague`] ? 'border-destructive' : ''}
                                        />
                                        {errors[`${index}.bague`] && (
                                            <p className="text-destructive text-xs mt-1">{errors[`${index}.bague`]}</p>
                                        )}
                                    </div>

                                    {/* Sexe */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Sexe <span className="text-destructive">*</span>
                                        </label>
                                        <select
                                            value={pigeonneau.sexe}
                                            onChange={(e) => handleChange(index, 'sexe', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${
                                                errors[`${index}.sexe`] ? 'border-destructive' : 'border-input'
                                            }`}
                                        >
                                            <option value="">Choisir...</option>
                                            <option value="male">♂ Mâle</option>
                                            <option value="femelle">♀ Femelle</option>
                                        </select>
                                        {errors[`${index}.sexe`] && (
                                            <p className="text-destructive text-xs mt-1">{errors[`${index}.sexe`]}</p>
                                        )}
                                    </div>

                                    {/* Race */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Race
                                        </label>
                                        <Input
                                            type="text"
                                            value={pigeonneau.race}
                                            onChange={(e) => handleChange(index, 'race', e.target.value)}
                                            placeholder="Race des parents"
                                        />
                                    </div>
                                </div>

                                {/* Bouton supprimer */}
                                {pigeonneaux.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => supprimerPigeonneau(index)}
                                        className="mt-8 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bouton ajouter */}
                {pigeonneaux.length < placesRestantes && pigeonneaux.length < maxJeunes && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={ajouterPigeonneau}
                        className="w-full gap-2 mb-6"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter un pigeonneau
                    </Button>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
                        disabled={isLoading || pigeonneaux.length === 0}
                        className=""
                    >
                        {isLoading ? 'Création...' : `Créer ${pigeonneaux.length} pigeonneau${pigeonneaux.length > 1 ? 'x' : ''}`}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
