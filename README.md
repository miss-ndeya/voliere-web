# Volière Web - Frontend

Interface web moderne et responsive pour la gestion complète d'une volière de pigeons voyageurs.

## Description

Application frontend développée avec React et Vite pour gérer une volière de pigeons. Interface intuitive avec dashboard, gestion des pigeons, couples, reproductions, cages et visualisation interactive de la volière.

## Fonctionnalités

### Dashboard
- Vue d'ensemble avec statistiques en temps réel
- Cartes KPI (pigeons actifs, couples, reproductions, cages)
- Liste des reproductions récentes
- Navigation rapide vers les sections

### Gestion des Pigeons
- Liste complète avec filtres (statut, sexe, race)
- Création et modification avec validation
- Historique détaillé de chaque pigeon
- Arbre généalogique interactif
- Validation : date de naissance ne peut pas être future

### Gestion des Couples
- Vue en cartes modernes (actifs / rompus)
- Formation de couples avec sélection de pigeons disponibles
- Modification selon présence de descendants
- Rupture de couples
- Historique complet

### Gestion des Reproductions
- Onglets "En cours" et "Éclos"
- Enregistrement des pontes et éclosions
- Création de pigeonneaux avec formulaire dynamique
- Compteur de pigeonneaux créés
- Validation : minimum 17 jours entre ponte et éclosion

### Gestion des Cages
- Liste des cages avec statut
- Affectation de pigeons ou couples
- Libération de cages
- Historique des affectations
- Validation : numéro unique, cage occupée non supprimable

### Visualisation Interactive
- Grille de cages avec code couleur :
  - Vert : cage libre
  - Orange : 1 pigeon
  - Rouge : couple
- Tooltip au clic avec informations
- Overlay avec bague du pigeon
- Panel latéral avec détails et actions
- Rafraîchissement automatique

### Sorties
- Enregistrement des ventes, décès, pertes
- Filtres par type et période
- Validation : champs conditionnels selon le type
- Libération automatique de cage et rupture de couple

### Arbre Généalogique
- Visualisation verticale : parents → pigeon → descendants
- Navigation entre pigeons par clic
- Affichage des informations complètes

## Technologies

- **Framework** : React 18
- **Build Tool** : Vite
- **Routing** : React Router v6
- **State Management** : React Query (TanStack Query)
- **HTTP Client** : Axios
- **Styling** : Tailwind CSS
- **Icons** : Lucide React
- **Authentification** : Context API + Laravel Sanctum

## Prérequis

- Node.js >= 18.x
- npm ou yarn
- Backend API en cours d'exécution

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/miss-ndeya/voliere-web.git
cd voliere-web
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

```bash
# Copier le fichier d'environnement
cp .env.example .env
```

Éditer `.env` :

```env
VITE_API_URL=http://localhost:8000
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Scripts disponibles

```bash
npm run dev       # Serveur de développement avec hot reload
npm run build     # Build de production optimisé
npm run preview   # Prévisualiser le build de production
npm run lint      # Vérifier le code avec ESLint
```

## Architecture

### Structure des dossiers

```
src/
├── api/                    # Configuration API et services
│   ├── axios.js           # Configuration Axios + intercepteurs
│   └── services/          # Services par entité
│       ├── authService.js
│       ├── pigeonService.js
│       ├── coupleService.js
│       ├── reproductionService.js
│       ├── cageService.js
│       └── sortieService.js
│
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── Card.jsx
│   │   └── Toast.jsx
│   ├── pigeons/          # Composants spécifiques pigeons
│   ├── couples/          # Composants spécifiques couples
│   ├── reproductions/    # Composants spécifiques reproductions
│   ├── cages/            # Composants spécifiques cages
│   ├── sorties/          # Composants spécifiques sorties
│   └── voliere/          # Composants visualisation
│
├── context/              # Context API
│   ├── AuthContext.jsx   # Authentification globale
│   ├── ToastContext.jsx  # Notifications globales
│   └── SidebarContext.jsx # État du sidebar
│
├── hooks/                # Hooks personnalisés
│   ├── usePigeons.js     # Logique pigeons + React Query
│   ├── useCouples.js     # Logique couples + React Query
│   ├── useReproductions.js
│   ├── useCages.js
│   ├── useSorties.js
│   └── useLogin.js
│
├── pages/                # Pages de l'application
│   ├── auth/
│   │   └── Login.jsx
│   ├── Dashboard.jsx
│   ├── pigeons/
│   │   ├── Pigeons.jsx
│   │   └── PigeonHistorique.jsx
│   ├── couples/
│   │   ├── Couples.jsx
│   │   └── CoupleHistorique.jsx
│   ├── reproductions/
│   │   ├── Reproductions.jsx
│   │   └── GenealogyTree.jsx
│   ├── cages/
│   │   ├── Cages.jsx
│   │   ├── CageHistorique.jsx
│   │   └── Visualisation.jsx
│   └── sorties/
│       └── Sorties.jsx
│
├── utils/                # Fonctions utilitaires
│   ├── historyHelpers.js
│   └── pigeons.js
│
├── App.jsx               # Composant racine + routes
├── main.jsx              # Point d'entrée
└── index.css             # Styles globaux + Tailwind
```

### Patterns utilisés

#### 1. Services API centralisés

```javascript
// src/api/services/pigeonService.js
export const pigeonService = {
  getAll: () => axios.get('/api/pigeons'),
  create: (data) => axios.post('/api/pigeons', data),
  update: (id, data) => axios.put(`/api/pigeons/${id}`, data),
  delete: (id) => axios.delete(`/api/pigeons/${id}`)
}
```

#### 2. Hooks personnalisés avec React Query

```javascript
// src/hooks/usePigeons.js
export function usePigeons() {
  const { showToast } = useToast()
  
  const pigeonsQuery = useQuery({
    queryKey: ['pigeons'],
    queryFn: () => pigeonService.getAll()
  })
  
  const createMutation = useMutation({
    mutationFn: (data) => pigeonService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['pigeons'])
      showToast('Pigeon créé avec succès', 'success')
    }
  })
  
  return {
    pigeons: pigeonsQuery.data,
    createPigeon: createMutation.mutateAsync
  }
}
```

#### 3. Composants modulaires

- Maximum 150 lignes par composant
- Séparation des responsabilités
- Props typées avec PropTypes ou TypeScript

## Design System

### Palette de couleurs

```css
/* Couleurs principales */
--primary: 10 80% 45%           /* Émeraude */
--cage-free: 142 76% 36%        /* Vert (cage libre) */
--cage-single: 0 84% 60%        /* Rouge (1 pigeon) */
--cage-couple: 25 95% 53%       /* Orange (couple) */

/* Couleurs UI */
--background: 0 0% 100%
--foreground: 222.2 84% 4.9%
--card: 0 0% 100%
--muted: 210 40% 96.1%
--border: 214.3 31.8% 91.4%
```

### Composants UI

Tous les composants de base sont dans `src/components/ui/` :

- **Button** - Boutons avec variantes (primary, secondary, destructive)
- **Input** - Champs de formulaire avec validation
- **Select** - Sélecteurs personnalisés
- **Modal** - Modales réutilisables
- **Badge** - Badges colorés pour statuts
- **Card** - Cards avec header/content/footer
- **Toast** - Notifications temporaires

### Icônes

Utilise **Lucide React** :

```jsx
import { Bird, Heart, Home, Plus, Pencil, Trash2 } from 'lucide-react'
```

## Authentification

L'application utilise un système d'authentification par token (Laravel Sanctum).

### Flux d'authentification

1. Login → Récupération du token
2. Stockage du token dans AuthContext
3. Intercepteur Axios ajoute le token à chaque requête
4. Redirection automatique vers `/login` si 401

### Protection des routes

```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  {/* Routes protégées */}
</Route>
```

## Responsive Design

L'application est entièrement responsive avec des breakpoints Tailwind :

- **Mobile** : < 768px
- **Tablette** : 768px - 1024px
- **Desktop** : > 1024px

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Contenu adaptatif */}
</div>
```

## 🌐 Déploiement

### Vercel

#### Via l'interface

1. Créer un compte sur [Vercel](https://vercel.com)
2. Importer le projet depuis GitHub
3. Configuration :
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
4. Variables d'environnement :
   ```
   VITE_API_URL=https://votre-api.railway.app
   ```
5. Déployer

#### Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Autres plateformes

Le build génère des fichiers statiques dans `dist/` compatibles avec :
- Netlify
- Cloudflare Pages
- GitHub Pages
- Firebase Hosting

## 🧪 Tests (À implémenter)

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e
```

## 🔧 Configuration

### Variables d'environnement

```env
# Développement
VITE_API_URL=http://localhost:8000

# Production
VITE_API_URL=https://votre-api.com
```

### Personnalisation du thème

Modifier `tailwind.config.js` et `src/index.css` pour personnaliser les couleurs et le design.

## Bonnes pratiques

1. **Composants** : Maximum 150 lignes
2. **Hooks** : Extraire la logique métier
3. **Services** : Centraliser les appels API
4. **Styles** : Utiliser Tailwind CSS
5. **État** : React Query pour données serveur, useState pour UI locale
6. **Nommage** : PascalCase pour composants, camelCase pour fonctions

## Debugging

### React DevTools

Installer l'extension [React DevTools](https://react.dev/learn/react-developer-tools)

### React Query DevTools

Ajouter dans `App.jsx` :

```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<ReactQueryDevtools initialIsOpen={false} />
```

## Build de production

```bash
npm run build
```

Génère les fichiers optimisés dans `dist/` :
- Minification du code
- Tree shaking
- Code splitting
- Optimisation des assets

## Documentation des dépendances

- [React](https://react.dev) - Framework UI
- [Vite](https://vitejs.dev) - Build tool
- [React Router](https://reactrouter.com) - Routing
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Lucide](https://lucide.dev) - Icons
- [Axios](https://axios-http.com) - HTTP client

## Licence

Ce projet est développé dans un cadre éducatif.

## Auteur

Développé dans le cadre d'un projet de gestion de volière pour DTS.
