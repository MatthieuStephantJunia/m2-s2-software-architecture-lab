# Software Architecture Lab API

API REST construite avec NestJS, TypeORM et SQLite.

Le projet expose des fonctionnalités autour de:

- l'authentification JWT
- la gestion des utilisateurs
- la gestion des posts
- la gestion des tags
- l'association de tags sur un post

## Stack

- Node.js
- NestJS
- TypeORM
- SQLite
- Swagger (OpenAPI)
- Jest
- Bruno (collection API)

## Prérequis

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
```

## Quickstart (5 etapes)

1. Configurer l'environnement

Copier `.env.example` vers `.env`, puis verifier les valeurs:

```env
PORT=3000
DATABASE_URL=database.db
NODE_ENV=development
```

2. Demarrer l'API

```bash
npm run start:dev
```

3. Initialiser les donnees de demo

Dans un second terminal:

```bash
npm run seed
```

4. Obtenir un token JWT

Exemple avec un utilisateur seed:

```http
POST /auth/login
Content-Type: application/json

{
	"username": "writer_user",
	"password": "password123"
}
```

5. Tester une route protegee

Utiliser le token recu dans le header:

```http
Authorization: Bearer <token>
```

Exemple:

```http
POST /posts
Content-Type: application/json
Authorization: Bearer <token>

{
	"title": "Mon premier post",
	"content": "Contenu de test"
}
```

## Configuration

Créer un fichier `.env` à la racine (ou copier `.env.example`) avec:

```env
PORT=3000
DATABASE_URL=database.db
NODE_ENV=development
```

Notes:

- `DATABASE_URL` doit pointer vers le fichier SQLite utilisé par l'application.
- Le script de seed lit cette même variable.

## Lancement

```bash
# démarrage standard
npm run start

# mode watch
npm run start:dev

# debug
npm run start:debug

# build production
npm run build

# exécution production
npm run start:prod
```

## Initialisation des données (seed)

```bash
npm run seed
```

Ce script:

- lit `seed.sql`
- se connecte à la base configurée par `DATABASE_URL`
- injecte les données de démonstration

## Documentation API (Swagger)

Une fois l'application lancée:

- Swagger UI: `http://localhost:3000/api`

## Endpoints principaux

### Auth

- `POST /auth/login`

### Users

- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PATCH /users/:id`
- `DELETE /users/:id`

### Posts

- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `PATCH /posts/:id`
- `DELETE /posts/:id`
- `POST /posts/:postId/tags/:tagId`

### Tags

- `GET /tags`
- `POST /tags`
- `PATCH /tags/:id`
- `DELETE /tags/:id`

## Authentification

- L'endpoint `POST /auth/login` retourne un token JWT.
- Les routes marquées `ApiBearerAuth` dans Swagger nécessitent le header:

```http
Authorization: Bearer <token>
```

## Tests et qualité

```bash
# lint
npm run lint

# format
npm run format

# tests unitaires
npm run test

# tests e2e
npm run test:e2e

# couverture
npm run test:cov
```

## Collection Bruno

Une collection Bruno est disponible dans:

- `bruno/software-architecture-lab`

Vous pouvez l'importer dans Bruno pour tester rapidement les routes.

## Structure du projet (résumé)

- `src/modules/shared`: auth, database, logging, gestion d'erreurs
- `src/modules/users`: domaine, use-cases, contrôleurs, persistance
- `src/modules/posts`: domaine, use-cases, contrôleurs, persistance
- `src/modules/tag`: domaine, use-cases, contrôleurs, persistance
- `seed.js` / `seed.sql`: initialisation de la base

## Remarques

- Le schéma SQLite est synchronisé par TypeORM au démarrage (`synchronize: true`).
- En environnement de production, il est recommandé de passer par des migrations.

# En cas de port déjà occuper :
# Get-NetTCPConnection -LocalPort 3000 | Select-Object -Expand OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force }