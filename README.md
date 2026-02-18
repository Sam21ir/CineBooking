# CineBooking

Application front-end React (Vite) de réservation de séances cinéma, conçue pour démontrer :
- une **architecture front-end claire**
- une **navigation multi-pages** (React Router)
- une **gestion d’état globale** (Redux Toolkit)
- des **appels API** (Axios + MockAPI) avec opérations CRUD
- des **animations** (Framer Motion)
- un workflow **n8n** (webhooks)
- une fonctionnalité **IA** (Gemini) avec fallback
- des **tests unitaires** (Jest + React Testing Library)
- un **déploiement Vercel**

## Fonctionnalités principales

- **Catalogue films** : liste, détails d’un film, films populaires, “Ma Liste”
- **Séances** : affichage des séances d’un film
- **Réservation** : sélection de sièges, checkout avec formulaire validé, confirmation
- **Compte** : register/login (MockAPI) + page profil protégée
- **IA (Gemini)** : recommandations personnalisées / films similaires / synopsis enrichi (si clé dispo)
- **Automatisation n8n** : webhook de confirmation de réservation (non bloquant)

## Parcours utilisateur (démo soutenance)

- Accueil → Films → Détail d’un film → Séances → Réservation (choix des sièges)
- Checkout : saisie nom/email + validation → confirmation
- Bonus : montrer la feature IA (si clé Gemini) et l’automatisation n8n (webhook)

## Stack & choix techniques

- **React 18** + **TypeScript**
- **Vite** (build/dev)
- **React Router DOM**
- **Redux Toolkit** + `react-redux`
- **Axios**
- **Framer Motion**
- **Tailwind CSS** + composants UI (Radix/shadcn-style)
- **Tests** : Jest + React Testing Library
- **Automation** : n8n via webhooks

## Installation & lancement

Pré-requis : Node.js 18+ (recommandé).

```bash
npm install
npm run dev
```

L’app tourne ensuite sur l’URL affichée par Vite.

### Scripts utiles

```bash
# Dev
npm run dev

# Build (prod)
npm run build

# Preview du build
npm run preview

# Tests
npm test
npm run test:watch
npm run test:coverage
```

## Configuration (variables d’environnement)

Ce projet utilise des variables Vite (`VITE_*`).

- Copier `ENV_EXAMPLE.txt` vers `.env` à la racine, puis adapter les valeurs
- Variables clés :
  - **IA Gemini** : `VITE_GEMINI_API_KEY` (optionnel, fallback si absent)
  - **n8n** : `VITE_N8N_BOOKING_WEBHOOK`, `VITE_N8N_REMINDER_WEBHOOK` (optionnel, non bloquant)

## API (MockAPI) & CRUD

Les appels Axios sont centralisés dans `src/services/api.ts`.

- **Movies/Sessions**
  - GET `/movies`, GET `/movies/:id`
  - GET `/sessions`, GET `/sessions/:id`
- **Seats/Bookings**
  - GET `/seats` (filtrage par session côté front)
  - POST `/bookings`
  - GET `/bookings`, GET `/bookings/:id`
- **Users**
  - GET `/users`, GET `/users/:id`
  - POST `/users` (register)
  - PUT `/users/:id` (update)
  - login simulé via recherche email + password

### Ajouter des séances pour les nouveaux films

Voir `ADDING_SESSIONS_GUIDE.md` (important si tu ajoutes des films dans MockAPI).

## Redux Toolkit (state global)

Store : `src/store/index.ts`

Slices (exemples) : `src/store/slices/*`
- `moviesSlice` (liste + film sélectionné)
- `sessionsSlice` (séances + séance sélectionnée)
- `seatsSlice` (sièges + sélection)
- `bookingsSlice` (création + historique)
- `usersSlice` (currentUser + auth)
- `myListSlice`, `recommendationsSlice`, `notificationsSlice`…

Chaque slice gère typiquement :
- `loading` (UI “loading”)
- `error` (feedback utilisateur)
- des thunks `createAsyncThunk` pour les appels API

## Animations (Framer Motion)

- Transitions de pages avec `AnimatePresence` dans `src/app/App.tsx`
- Animations d’entrée/sortie dans certaines pages (ex: Booking/Checkout)

## IA (Gemini)

Service : `src/services/aiService.ts`

- Si `VITE_GEMINI_API_KEY` est configurée, le projet appelle Gemini (modèle `gemini-1.5-flash`)
- Si la clé est absente/invalide, le projet utilise un **fallback** (reco basées sur rating + shuffle)

## Automatisation n8n

Service : `src/services/webhookService.ts`

- Webhook déclenché au Checkout après création de réservation
- Le webhook est **non bloquant** : une erreur n’empêche pas la réservation

Doc n8n : voir `n8n/README.md` (variables + payload + workflow minimal).

## Tests

- Config : `jest.config.js` + `src/setupTests.ts`
- Résumé : `TESTING_SUMMARY.md`

```bash
npm test
```

## Déploiement (Vercel)

- Framework : Vite (React)
- Build Command : `npm run build`
- Output Directory : `dist`
- Variables d’environnement : copier celles de `.env` dans le dashboard Vercel

Note : l’app utilise `HashRouter` (URLs avec `#`) pour éviter les erreurs de refresh sur une SPA sans configuration serveur.

## Notes perf

Pour réduire le bundle initial, les pages sont chargées en **lazy** (code-splitting) dans `src/app/App.tsx`.
