# Baay Pitàq — Interface web

Application React pour gérer une volière de pigeons : effectif, couples, reproductions, cages, sorties et visualisation en temps réel.

## Application en ligne

- **Web** : https://voliere-web.vercel.app/login
- **API** : https://voliere-api-production.up.railway.app/api

## Contexte et objectifs

Baay Pitàq est un éleveur qui gérait sa volière sur papier. L’application répond à :

- l’identification des pigeons (bagues, fiches, généalogie) ;
- la visibilité des cages libres ou occupées ;
- le suivi des reproductions et des sorties (vente, décès, perte).

Objectif : une interface **responsive** utilisable sur téléphone et ordinateur.

## Fonctionnalités

- Authentification (connexion, déconnexion, profil depuis le menu en haut à droite)
- Pigeons : CRUD, historique, sortie logique, suppression sans descendants
- Couples : formation, liste actifs/rompus, rupture
- Reproductions : ponte, éclosion, création des jeunes
- Sorties : vente, décès, perte
- Cages : CRUD, affectation, libération, historique
- Volière : grille verte / rouge / orange, affectation sans rechargement
- Généalogie : parents, descendants, grands-parents si renseignés

## Stack

React 18, Vite, React Router, TanStack Query, Tailwind CSS, Axios, Laravel Sanctum (token).

## Prérequis

- Node.js 18+
- npm 9+
- API Laravel accessible (locale ou Railway)

## Installation locale

```bash
git clone <url-du-repo-voliere-web>
cd voliere-web
npm install
cp .env.example .env
```

Fichier `.env` :

```env
VITE_API_URL=http://localhost:8000/api
```

```bash
npm run dev
```

Ouvrir http://localhost:5173

## Comptes de test

Comptes créés par l’API (`UserSeeder` / `DemoSeeder` sur le backend) :

| E-mail | Mot de passe |
|--------|----------------|
| baaypitaq@voliere.com | 123456 |
| demo@voliere.com | password |

## Déploiement sur Vercel

1. Connecter le dépôt GitHub du frontend à Vercel.
2. **Root Directory** : racine du repo (ou `voliere-web` si monorepo).
3. Variable d’environnement **obligatoire** :

```env
VITE_API_URL=https://voliere-api-production.up.railway.app/api
```

4. Build : `npm run build` — sortie `dist/`.
5. Redéployer après chaque push.

Important : Vite injecte `VITE_API_URL` **au moment du build**. Si la variable n’est pas définie sur Vercel, le build utilisait l’URL locale. Désormais un repli production existe dans `src/api/axios.js`, mais configurez quand même la variable sur Vercel.

Aucune migration côté frontend.

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement |
| `npm run build` | Build production |
| `npm run preview` | Prévisualiser le build |

## Structure

```
src/
  api/           # Axios + services
  components/    # UI, modales (portail document.body)
  pages/         # Écrans
  hooks/         # React Query
  context/       # Auth, sidebar
```

## Dépôt API

Backend séparé : voir le README du dépôt `voliere-api`.
