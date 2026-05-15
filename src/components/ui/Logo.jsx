import logoImage from '../../assets/logo-baay-pitaq.png'

/**
 * Composant Logo de l'application
 * @param {Object} props
 * @param {string} props.size - Taille du logo (sm, md, lg, xl)
 * @param {boolean} props.showText - Afficher le texte
 * @param {boolean} props.showBackground - Afficher le background
 * @param {string} props.className - Classes CSS additionnelles
 */
const Logo = ({ size = 'md', showText = true, showBackground = false, className = '' }) => {
  const sizes = {
    sm: { container: 'h-10', text: 'text-lg', bg: 'p-2' },
    md: { container: 'h-10', text: 'text-xl', bg: 'p-2' },
    lg: { container: 'h-10', text: 'text-3xl', bg: 'p-2' },
    xl: { container: 'h-10', text: 'text-4xl', bg: 'p-2' }
  }

  const currentSize = sizes[size] || sizes.md

  const logoElement = (
    <img
      src={logoImage}
      alt="Baay Pitàq Logo"
      className={`${currentSize.container} w-auto object-contain`}
    />
  )

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showBackground ? (
          <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-lg bg-sidebar-foreground ring-1 ring-primary-foreground">
              <img src={logoImage} alt="Baay Pitàq" width={44} height={44} className="h-9 w-9 object-contain" />
            </div>
      ) : (
        logoElement
      )}

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="font-display text-xl font-bold text-foreground">Baay Pitàq</span>
          <span className="text-xs text-muted-foreground">Gestion de volière</span>
        </div>
      )}
    </div>
  )
}

export default Logo
