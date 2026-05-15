/**
 * Export centralisé des composants UI Baay Pitàq
 * 
 * Usage Option 1 (recommandé):
 * import { Card } from '@/components/ui'
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Titre</Card.Title>
 *   </Card.Header>
 * </Card>
 * 
 * Usage Option 2 (import destructuré):
 * import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Titre</CardTitle>
 *   </CardHeader>
 * </Card>
 */

export { default as Button } from './Button'
export { default as Card } from './Card'
export { default as Badge } from './Badge'
export { default as Input } from './Input'
export { default as Select } from './Select'
export { default as StatCard } from './StatCard'
export { default as StatsGrid } from './StatsGrid'
export { Modal } from './Modal'
export { ConfirmModal } from './ConfirmModal'
export { default as ConfirmDialog } from './ConfirmDialog'
export { default as Toast } from './Toast'
export { default as ToastContainer } from './ToastContainer'
export { default as FormField } from './FormField'
export { default as Logo } from './Logo'
export { default as Sheet } from './Sheet'
export { default as Tabs } from './Tabs'
export { DataTable } from './DataTable'
export { Tooltip } from './Tooltip'
export * from './Table'
export * from './Sheet'
export * from './Tabs'

// Export des skeletons
export * from '../skeletons'

// Export des sous-composants Card pour import destructuré
import CardComponent from './Card'
export const CardHeader = CardComponent.Header
export const CardTitle = CardComponent.Title
export const CardDescription = CardComponent.Description
export const CardContent = CardComponent.Content
export const CardFooter = CardComponent.Footer
