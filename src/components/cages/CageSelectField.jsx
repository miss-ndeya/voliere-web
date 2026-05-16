/**
 * Sélecteur de cage optionnel (création pigeon / couple)
 */
export function CageSelectField({ label, value, onChange, cages = [], hint, disabled }) {
    return (
        <div className="border-t border-border pt-4 mt-2">
            <label htmlFor="cage_id" className="block text-sm font-medium text-foreground mb-2">
                {label}
            </label>
            <select
                id="cage_id"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            >
                <option value="">Sans cage pour l&apos;instant</option>
                {cages.map((c) => (
                    <option key={c.id} value={c.id}>
                        Cage {c.numero} — {c.nom}
                        {c.statut === 'occupe' ? ' (partenaire déjà ici)' : ''}
                    </option>
                ))}
            </select>
            {hint && <p className="text-muted-foreground text-xs mt-1">{hint}</p>}
        </div>
    )
}
