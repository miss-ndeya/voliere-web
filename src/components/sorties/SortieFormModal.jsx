import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { pigeonService } from '../../api/services/pigeonService'
import { Modal } from '../ui/Modal'
import Input from '../ui/Input'

/**
 * Modal de formulaire pour créer/modifier une sortie
 */
export function SortieFormModal({ isOpen, onClose, sortie, preselectedPigeonId, onSubmit, isLoading }) {
    const [form, setForm] = useState({
        pigeon_id: '',
        type: '',
        date_sortie: '',
        prix: '',
        acheteur: '',
        cause: '',
        circonstance: ''
    })

    const [errors, setErrors] = useState({})

    // Récupérer la liste des pigeons actifs
    const { data: pigeons } = useQuery({
        queryKey: ['pigeons'],
        queryFn: () => pigeonService.getAll(),
        enabled: isOpen
    })

    // Pré-remplir le formulaire en mode édition OU avec pigeon pré-sélectionné
    useEffect(() => {
        if (sortie) {
            // Mode édition d'une sortie existante
            setForm({
                pigeon_id: sortie.pigeon_id || '',
                type: sortie.type || '',
                // Convertir la date ISO en format yyyy-MM-dd pour l'input
                date_sortie: sortie.date_sortie ? sortie.date_sortie.split('T')[0] : '',
                prix: sortie.prix || '',
                acheteur: sortie.acheteur || '',
                cause: sortie.cause || '',
                circonstance: sortie.circonstance || ''
            })
        } else if (preselectedPigeonId) {
            // Mode création avec pigeon pré-sélectionné
            setForm({
                pigeon_id: preselectedPigeonId.toString(),
                type: '',
                date_sortie: '',
                prix: '',
                acheteur: '',
                cause: '',
                circonstance: ''
            })
        } else {
            // Mode création normal
            setForm({
                pigeon_id: '',
                type: '',
                date_sortie: '',
                prix: '',
                acheteur: '',
                cause: '',
                circonstance: ''
            })
        }
        setErrors({})
    }, [sortie, preselectedPigeonId, isOpen])

    // Validation côté client
    const validate = () => {
        const newErrors = {}

        if (!form.pigeon_id) {
            newErrors.pigeon_id = 'Le pigeon est requis'
        }

        if (!form.type) {
            newErrors.type = 'Le type de sortie est requis'
        }

        if (!form.date_sortie) {
            newErrors.date_sortie = 'La date est requise'
        } else {
            // Vérifier que la date n'est pas dans le futur
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const selectedDate = new Date(form.date_sortie)
            selectedDate.setHours(0, 0, 0, 0)

            if (selectedDate > today) {
                newErrors.date_sortie = 'La date ne peut pas être dans le futur'
            }
        }

        // Validations conditionnelles selon le type
        if (form.type === 'vente') {
            if (!form.prix) {
                newErrors.prix = 'Le prix est requis pour une vente'
            } else if (parseFloat(form.prix) < 0) {
                newErrors.prix = 'Le prix doit être supérieur ou égal à 0'
            }

            if (!form.acheteur || !form.acheteur.trim()) {
                newErrors.acheteur = 'Le nom de l\'acheteur est requis pour une vente'
            }
        }

        if (form.type === 'deces') {
            if (!form.cause || !form.cause.trim()) {
                newErrors.cause = 'La cause du décès est requise'
            }
        }

        if (form.type === 'perte') {
            if (!form.circonstance || !form.circonstance.trim()) {
                newErrors.circonstance = 'La circonstance de la perte est requise'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validate()) return

        try {
            // En mode édition (avec sortie.id), ne pas envoyer pigeon_id (non modifiable)
            const dataToSubmit = { ...form }
            if (sortie?.id) {
                delete dataToSubmit.pigeon_id
            }

            await onSubmit(dataToSubmit)
            handleClose()
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors)
            }
        }
    }

    const handleClose = () => {
        setForm({
            pigeon_id: '',
            type: '',
            date_sortie: '',
            prix: '',
            acheteur: '',
            cause: '',
            circonstance: ''
        })
        setErrors({})
        onClose()
    }

    // Filtrer les pigeons actifs uniquement (sauf en mode édition)
    const pigeonsActifs = sortie?.id
        ? pigeons || []
        : pigeons?.filter(p => p.statut === 'actif') || []

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={sortie ? 'Modifier la sortie' : 'Nouvelle sortie'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pigeon */}
                    <div>
                        <label htmlFor="pigeon_id" className="block text-sm font-medium text-foreground mb-2">
                            Pigeon <span className="text-destructive">*</span>
                        </label>
                        <select
                            id="pigeon_id"
                            value={form.pigeon_id}
                            onChange={(e) => setForm({ ...form, pigeon_id: e.target.value })}
                            disabled={isLoading || sortie?.id} // Désactiver seulement en mode édition
                            className={`w-full border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${errors.pigeon_id ? 'border-destructive' : 'border-input'
                                } ${sortie?.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            <option value="">Choisir un pigeon...</option>
                            {pigeonsActifs.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.bague} — {p.race}
                                </option>
                            ))}
                        </select>
                        {errors.pigeon_id && (
                            <p className="text-xs text-destructive mt-1">{errors.pigeon_id}</p>
                        )}
                    </div>

                    {/* Type de sortie */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-foreground mb-2">
                            Type de sortie <span className="text-destructive">*</span>
                        </label>
                        <select
                            id="type"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            disabled={isLoading}
                            className={`w-full border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${errors.type ? 'border-destructive' : 'border-input'
                                }`}
                        >
                            <option value="">Choisir...</option>
                            <option value="vente">Vente</option>
                            <option value="deces">Décès</option>
                            <option value="perte">Perte</option>
                        </select>
                        {errors.type && (
                            <p className="text-xs text-destructive mt-1">{errors.type}</p>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="date_sortie" className="block text-sm font-medium text-foreground mb-2">
                            Date <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="date_sortie"
                            type="date"
                            value={form.date_sortie}
                            onChange={(e) => setForm({ ...form, date_sortie: e.target.value })}
                            max={new Date().toISOString().split('T')[0]}
                            disabled={isLoading}
                            className={errors.date_sortie ? 'border-destructive' : ''}
                        />
                        {errors.date_sortie && (
                            <p className="text-xs text-destructive mt-1">{errors.date_sortie}</p>
                        )}
                    </div>

                    {/* Champs conditionnels selon le type */}
                    {form.type === 'vente' && (
                        <>
                            <div>
                                <label htmlFor="prix" className="block text-sm font-medium text-foreground mb-2">
                                    Prix (FCFA) <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    id="prix"
                                    type="number"
                                    min="0"
                                    value={form.prix}
                                    onChange={(e) => setForm({ ...form, prix: e.target.value })}
                                    placeholder="Ex: 50000"
                                    disabled={isLoading}
                                    className={errors.prix ? 'border-destructive' : ''}
                                />
                                {errors.prix && (
                                    <p className="text-xs text-destructive mt-1">{errors.prix}</p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="acheteur" className="block text-sm font-medium text-foreground mb-2">
                                    Acheteur <span className="text-destructive">*</span>
                                </label>
                                <textarea
                                    id="acheteur"
                                    type="text"
                                    value={form.acheteur}
                                    onChange={(e) => setForm({ ...form, acheteur: e.target.value })}
                                    placeholder="Nom de l'acheteur"
                                    rows={3}
                                    disabled={isLoading}
                                    className={`${errors.acheteur ? 'border-destructive' : ''} flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                                />
                                {errors.acheteur && (
                                    <p className="text-xs text-destructive mt-1">{errors.acheteur}</p>
                                )}
                            </div>
                        </>
                    )}

                    {form.type === 'deces' && (
                        <div className="md:col-span-2">
                            <label htmlFor="cause" className="block text-sm font-medium text-foreground mb-2">
                                Cause du décès <span className="text-destructive">*</span>
                            </label>
                            <textarea
                                id="cause"
                                type="text"
                                value={form.cause}
                                onChange={(e) => setForm({ ...form, cause: e.target.value })}
                                placeholder="Ex: Maladie, accident..."
                                rows={3}
                                disabled={isLoading}
                                className={`${errors.cause ? 'border-destructive' : ''} flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                            />
                            {errors.cause && (
                                <p className="text-xs text-destructive mt-1">{errors.cause}</p>
                            )}
                        </div>
                    )}

                    {form.type === 'perte' && (
                        <div className="md:col-span-2">
                            <label htmlFor="circonstance" className="block text-sm font-medium text-foreground mb-2">
                                Circonstance de la perte <span className="text-destructive">*</span>
                            </label>
                            <textarea
                                id="circonstance"
                                type="text"
                                value={form.circonstance}
                                onChange={(e) => setForm({ ...form, circonstance: e.target.value })}
                                placeholder="Ex: Évasion, vol..."
                                disabled={isLoading}
                                rows={3}
                                className={`${errors.circonstance ? 'border-destructive' : ''} flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                            />
                            {errors.circonstance && (
                                <p className="text-xs text-destructive mt-1">{errors.circonstance}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="bg-muted text-muted-foreground py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary text-primary-foreground py-2.5 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {sortie ? 'Modifier' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
