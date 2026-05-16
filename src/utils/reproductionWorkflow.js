const STATUT = {
  INCUBATION: 'incubation',
  ECLOSION_PREVUE: 'eclosion_prevue',
  A_BAGUER: 'a_baguer',
  TERMINEE: 'terminee',
}

export const STATUT_LABELS = {
  [STATUT.INCUBATION]: 'En incubation',
  [STATUT.ECLOSION_PREVUE]: 'Éclosion prévue',
  [STATUT.A_BAGUER]: 'À baguer',
  [STATUT.TERMINEE]: 'Terminée',
}

export function getStatutLabel(statut) {
  return STATUT_LABELS[statut] || statut
}

export function isEnCours(statut) {
  return statut === STATUT.INCUBATION || statut === STATUT.ECLOSION_PREVUE
}

export function isABaguer(statut) {
  return statut === STATUT.A_BAGUER
}

export function isTerminee(statut) {
  return statut === STATUT.TERMINEE
}

/** Filtre les couples éligibles à une nouvelle reproduction */
export function filterCouplesPourNouvelleReproduction(couples, reproductions, editingReproduction = null) {
  if (!couples) return []

  return couples.filter((c) => {
    if (!c.actif) return false
    if (editingReproduction && c.id === editingReproduction.couple_id) return true

    const hasActive = reproductions?.some(
      (r) => r.couple_id === c.id && r.statut !== STATUT.TERMINEE && r.id !== editingReproduction?.id
    )
    return !hasActive
  })
}

export { STATUT }
