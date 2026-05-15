import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Bird } from 'lucide-react'
import Button from '../components/ui/Button'

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Bird className="h-16 w-16 text-primary animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-destructive">?</span>
            </div>
          </div>
        </div>

        {/* Titre */}
        <h1 className="font-display text-6xl md:text-8xl font-bold text-foreground mb-4">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
          Page introuvable
        </h2>
        
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Oups ! Le pigeon que vous cherchez s'est envolé. 
          Cette page n'existe pas ou a été déplacée.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button className="gap-2 w-full">
              <Home className="h-4 w-4" />
              Accueil
            </Button>
          </Link>
        </div>

        {/* Liens utiles */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Liens utiles :
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link to="/pigeons" className="text-primary hover:underline">
              Pigeons
            </Link>
            <Link to="/couples" className="text-primary hover:underline">
              Couples
            </Link>
            <Link to="/reproductions" className="text-primary hover:underline">
              Reproductions
            </Link>
            <Link to="/cages" className="text-primary hover:underline">
              Cages
            </Link>
            <Link to="/sorties" className="text-primary hover:underline">
              Sorties
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
