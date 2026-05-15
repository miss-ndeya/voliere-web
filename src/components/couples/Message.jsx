import React from 'react'
import { Button } from '../ui'
import { Plus } from 'lucide-react'

const Message = ({activeTab, setShowModal, }) => {
    return (
        <div className="bg-card rounded-lg border border-border p-8 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-3">
                {activeTab === 'actifs' ? 'Aucun couple actif' : 'Aucun couple rompu'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                {activeTab === 'actifs'
                    ? "Commencez par former un couple de pigeons pour suivre leurs reproductions et gérer votre élevage."
                    : "Les couples rompus apparaîtront ici pour consultation de leur historique."
                }
            </p>

            {activeTab === 'actifs' && (
                <Button onClick={() => setShowModal(true)} className="gap-2" size="lg">
                    <Plus className="h-5 w-5" />
                    Former un couple
                </Button>
            )}
        </div>
    )
}

export default Message