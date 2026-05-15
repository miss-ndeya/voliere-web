/**
 * Composant Card avec le design Baay Pitàq
 */

export function Card({ children, className = '', ...props }) {
    return (
        <div 
            className={`rounded-lg border bg-card text-card-foreground shadow ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

export function CardHeader({ children, className = '', ...props }) {
    return (
        <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
            {children}
        </div>
    )
}

export function CardTitle({ children, className = '', ...props }) {
    return (
        <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props}>
            {children}
        </h3>
    )
}

export function CardDescription({ children, className = '', ...props }) {
    return (
        <p className={`text-sm text-muted-foreground ${className}`} {...props}>
            {children}
        </p>
    )
}

export function CardContent({ children, className = '', ...props }) {
    return (
        <div className={`p-6 ${className}`} {...props}>
            {children}
        </div>
    )
}

export function CardFooter({ children, className = '', ...props }) {
    return (
        <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
            {children}
        </div>
    )
}

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card
