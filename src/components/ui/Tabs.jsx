/**
 * Composant Tabs avec le design Baay Pitàq
 */

export function Tabs({ defaultValue, value, onValueChange, children, className = '' }) {
    const [selectedValue, setSelectedValue] = React.useState(defaultValue)
    
    const currentValue = value !== undefined ? value : selectedValue
    const handleChange = (newValue) => {
        if (onValueChange) {
            onValueChange(newValue)
        } else {
            setSelectedValue(newValue)
        }
    }

    return (
        <div className={`w-full ${className}`} data-value={currentValue}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { value: currentValue, onValueChange: handleChange })
                }
                return child
            })}
        </div>
    )
}

export function TabsList({ children, className = '', value, onValueChange }) {
    return (
        <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { 
                        currentValue: value, 
                        onValueChange 
                    })
                }
                return child
            })}
        </div>
    )
}

export function TabsTrigger({ value, children, className = '', currentValue, onValueChange }) {
    const isActive = currentValue === value
    
    return (
        <button
            type="button"
            onClick={() => onValueChange?.(value)}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                isActive 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'hover:bg-background/50'
            } ${className}`}
        >
            {children}
        </button>
    )
}

export function TabsContent({ value, children, className = '' }) {
    const parentValue = React.useContext(TabsContext)
    
    if (parentValue !== value) return null
    
    return (
        <div className={className}>
            {children}
        </div>
    )
}

// Context pour passer la valeur
const TabsContext = React.createContext(null)

// Version améliorée avec Context
import React from 'react'

export default Tabs
