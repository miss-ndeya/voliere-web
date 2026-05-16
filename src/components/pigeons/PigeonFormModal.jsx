import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { pigeonService } from '../../api/services/pigeonService'
import { cageService } from '../../api/services/cageService'
import { CageSelectField } from '../cages/CageSelectField'
import { Modal } from '../ui/Modal'
import Input from '../ui/Input'

/**
 * Modal de formulaire pour créer/modifier un pigeon
 */
export function PigeonFormModal({ isOpen, onClose, pigeon, onSubmit, isLoading }) {
    const [form, setForm] = useState({
        bague: '',
        sexe: '',
        race: '',
        date_naissance: '',
        pere_id: '',
        mere_id: '',
        cage_id: ''
    })
    
    const [errors, setErrors] = useState({})

    // Récupérer la liste des pigeons pour les parents
    const { data: pigeons } = useQuery({
        queryKey: ['pigeons'],
        queryFn: () => pigeonService.getAll(),
        enabled: isOpen
    })

    const { data: cages } = useQuery({
        queryKey: ['cages'],
        queryFn: () => cageService.getAll(),
        enabled: isOpen && !pigeon
    })

    const cagesLibres = cages?.filter((c) => c.statut === 'libre') || []

    // Pré-remplir le formulaire en mode édition
    useEffect(() => {
        if (pigeon) {
            setForm({
                bague: pigeon.bague || '',
                sexe: pigeon.sexe || '',
                race: pigeon.race || '',
                date_naissance: pigeon.date_naissance || '',
                pere_id: pigeon.pere_id || '',
                mere_id: pigeon.mere_id || '',
                cage_id: ''
            })
        } else {
            setForm({
                bague: '',
                sexe: '',
                race: '',
                date_naissance: '',
                pere_id: '',
                mere_id: '',
                cage_id: ''
            })
        }
        setErrors({})
    }, [pigeon, isOpen])

    // Validation côté client
    const validate = () => {
        const newErrors = {}

        if (!form.bague.trim()) {
            newErrors.bague = 'Le numéro de bague est requis'
        }

        if (!form.sexe) {
            newErrors.sexe = 'Le sexe est requis'
        }

        if (!form.race.trim()) {
            newErrors.race = 'La race est requise'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validate()) return

        try {
            const payload = { ...form }
            if (!payload.cage_id) delete payload.cage_id
            await onSubmit(payload)
            // Ne pas fermer ici, le parent le fera après succès
        } catch (error) {
            // Afficher les erreurs backend
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors)
            }
        }
    }

    const handleClose = () => {
        setForm({
            bague: '',
            sexe: '',
            race: '',
            date_naissance: '',
            pere_id: '',
            mere_id: '',
            cage_id: ''
        })
        setErrors({})
        onClose()
    }

    // Filtrer les pigeons pour les parents (mâles pour père, femelles pour mère)
    const pigeonsMales = pigeons?.filter(p => p.sexe === 'male' && p.id !== pigeon?.id) || []
    const pigeonsFemelles = pigeons?.filter(p => p.sexe === 'femelle' && p.id !== pigeon?.id) || []

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={pigeon ? 'Modifier le pigeon' : 'Nouveau pigeon'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Numéro de bague */}
                    <div>
                        <label htmlFor="bague" className="block text-sm font-medium text-foreground mb-2">
                            Numéro de bague <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="bague"
                            type="text"
                            value={form.bague}
                            onChange={(e) => setForm({ ...form, bague: e.target.value })}
                            placeholder="Ex: SN-2024-001"
                            disabled={isLoading}
                            className={errors.bague ? 'border-destructive' : ''}
                        />
                        {errors.bague && (
                            <p className="text-xs text-destructive mt-1">{errors.bague}</p>
                        )}
                    </div>

                    {/* Sexe */}
                    <div>
                        <label htmlFor="sexe" className="block text-sm font-medium text-foreground mb-2">
                            Sexe <span className="text-destructive">*</span>
                        </label>
                        <select
                            id="sexe"
                            value={form.sexe}
                            onChange={(e) => setForm({ ...form, sexe: e.target.value })}
                            disabled={isLoading}
                            className={`w-full border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${
                                errors.sexe ? 'border-destructive' : 'border-input'
                            }`}
                        >
                            <option value="">Choisir...</option>
                            <option value="male">♂ Mâle</option>
                            <option value="femelle">♀ Femelle</option>
                        </select>
                        {errors.sexe && (
                            <p className="text-xs text-destructive mt-1">{errors.sexe}</p>
                        )}
                    </div>

                    {/* Race */}
                    <div>
                        <label htmlFor="race" className="block text-sm font-medium text-foreground mb-2">
                            Race <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="race"
                            type="text"
                            value={form.race}
                            onChange={(e) => setForm({ ...form, race: e.target.value })}
                            placeholder="Ex: Voyageur"
                            disabled={isLoading}
                            className={errors.race ? 'border-destructive' : ''}
                        />
                        {errors.race && (
                            <p className="text-xs text-destructive mt-1">{errors.race}</p>
                        )}
                    </div>

                    {/* Date de naissance */}
                    <div>
                        <label htmlFor="date_naissance" className="block text-sm font-medium text-foreground mb-2">
                            Date de naissance
                        </label>
                        <Input
                            id="date_naissance"
                            type="date"
                            value={form.date_naissance}
                            onChange={(e) => setForm({ ...form, date_naissance: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Père */}
                    <div>
                        <label htmlFor="pere_id" className="block text-sm font-medium text-foreground mb-2">
                            Père
                        </label>
                        <select
                            id="pere_id"
                            value={form.pere_id}
                            onChange={(e) => setForm({ ...form, pere_id: e.target.value })}
                            disabled={isLoading}
                            className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            <option value="">Aucun</option>
                            {pigeonsMales.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.bague} - {p.race}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Mère */}
                    <div>
                        <label htmlFor="mere_id" className="block text-sm font-medium text-foreground mb-2">
                            Mère
                        </label>
                        <select
                            id="mere_id"
                            value={form.mere_id}
                            onChange={(e) => setForm({ ...form, mere_id: e.target.value })}
                            disabled={isLoading}
                            className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            <option value="">Aucune</option>
                            {pigeonsFemelles.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.bague} - {p.race}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>


                {!pigeon && (
                    <CageSelectField
                        label="Cage (optionnel)"
                        value={form.cage_id}
                        onChange={(v) => setForm({ ...form, cage_id: v })}
                        cages={cagesLibres}
                        disabled={isLoading}
                        hint="Affectez le pigeon dès l'enregistrement pour éviter un passage par la volière."
                    />
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 bg-muted text-muted-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {pigeon ? 'Modifier' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
