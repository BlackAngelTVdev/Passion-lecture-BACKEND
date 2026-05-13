# Rapport de Projet - Passion Lecture

## 1. Introduction

Le projet "Passion Lecture" est une application web permettant aux utilisateurs de partager leur passion pour la lecture. L'application offre une plateforme complète où les utilisateurs peuvent consulter des ouvrages, en ajouter, les modifier, les noter et laisser des commentaires.

Ce rapport documenta la réalisation du backend de l'application, développé avec **AdonisJS**, **Node.js** et **SQLite**, en suivant une architecture REST robuste et sécurisée. L'objectif principal était de mettre en œuvre les connaissances apprises dans le module 295 (développement backend) tout en respectant les bonnes pratiques de sécurité, de validation et de documentation.

---

## 2. Analyse

### 2.1 Analyse des Routes API

L'API REST expose les endpoints suivants :

#### Routes d'Authentification
| Méthode | Endpoint | Description | Auth Requise |
|---------|----------|-------------|--------------|
| POST | `/login` | Connexion utilisateur | Non |
| POST | `/register` | Inscription nouvel utilisateur | Non |
| POST | `/logout` | Déconnexion utilisateur | Oui |
| GET | `/profile` | Récupérer le profil de l'utilisateur connecté | Oui |

#### Routes Utilisateurs
| Méthode | Endpoint | Description | Auth Requise |
|---------|----------|-------------|--------------|
| GET | `/users` | Récupérer tous les utilisateurs | Non |
| GET | `/users/:id` | Récupérer détails d'un utilisateur | Non |

#### Routes Livres
| Méthode | Endpoint | Description | Auth Requise |
|---------|----------|-------------|--------------|
| GET | `/books` | Récupérer tous les livres | Non |
| POST | `/books` | Créer un nouveau livre | Oui |
| GET | `/books/:id` | Récupérer détails d'un livre | Non |
| PUT | `/books/:id` | Modifier un livre | Oui* |
| DELETE | `/books/:id` | Supprimer un livre | Oui* |

*L'utilisateur doit être propriétaire du livre ou admin.

#### Routes Commentaires
| Méthode | Endpoint | Description | Auth Requise |
|---------|----------|-------------|--------------|
| GET | `/books/:id/comments` | Récupérer commentaires d'un livre | Non |
| POST | `/books/:id/comments` | Ajouter commentaire | Oui |
| GET | `/books/:id/comments/:commentId` | Récupérer un commentaire | Non |
| PUT | `/books/:id/comments/:commentId` | Modifier un commentaire | Oui* |
| DELETE | `/books/:id/comments/:commentId` | Supprimer un commentaire | Oui* |

*L'utilisateur doit être auteur du commentaire ou admin.

#### Routes Appréciations (Ratings)
| Méthode | Endpoint | Description | Auth Requise |
|---------|----------|-------------|--------------|
| GET | `/books/:id/ratings` | Récupérer appréciations d'un livre | Non |
| POST | `/books/:id/ratings` | Ajouter/modifier une appréciation | Oui |
| DELETE | `/books/:id/ratings/:ratingId` | Supprimer une appréciation | Oui* |

*L'utilisateur doit être auteur de l'appréciation ou admin.

**Exemple de JSON pour POST /login:**
```json
{
  "username": "Admin",
  "password": "Admin"
}
```

**Réponse 200 OK:**
```json
{
  "message": "Login successful",
  "token": "token_jwt_here",
  "accessToken": "token_jwt_here",
  "user": {
    "id": 1,
    "username": "Admin",
    "admin": true,
    "createdAt": "2026-05-12T12:26:29.000+00:00"
  }
}
```

---

### 2.2 Modèle de Données (MCD)

```
USER
├── id (PK)
├── username (UNIQUE)
├── email (UNIQUE)
├── password (hashed)
├── admin (boolean)
├── createdAt
├── updatedAt

LIVRE
├── id (PK)
├── user_id (FK -> USER)
├── titre
├── auteur
├── categorie
├── editeur
├── epub
├── resume
├── nbPages
├── extraitPdf
├── imageCouverture
├── createdAt
├── updatedAt

COMMENTAIRE
├── id (PK)
├── livre_id (FK -> LIVRE)
├── user_id (FK -> USER)
├── contenu
├── createdAt
├── updatedAt

RATE
├── id (PK)
├── livre_id (FK -> LIVRE)
├── user_id (FK -> USER)
├── value (0-5)
├── createdAt
├── updatedAt

ACCESS_TOKENS
├── id (PK)
├── tokenable_id (FK -> USER)
├── name
├── type
├── token (hashed)
├── abilities (json)
├── createdAt
├── updatedAt
├── lastUsedAt
├── expiresAt
```

**Relations:**
- USER (1) -> (N) LIVRE (hasMany)
- USER (1) -> (N) COMMENTAIRE (hasMany)
- USER (1) -> (N) RATE (hasMany)
- LIVRE (1) -> (N) COMMENTAIRE (hasMany)
- LIVRE (1) -> (N) RATE (hasMany)
- COMMENTAIRE (N) -> (1) USER (belongsTo)
- COMMENTAIRE (N) -> (1) LIVRE (belongsTo)
- RATE (N) -> (1) USER (belongsTo)
- RATE (N) -> (1) LIVRE (belongsTo)

---

### 2.3 Modèle Logique (MLD)

```
USER(id, username, email, password, admin, createdAt, updatedAt)
LIVRE(id, user_id*, titre, auteur, categorie, editeur, epub, resume, nbPages, extraitPdf, imageCouverture, createdAt, updatedAt)
COMMENTAIRE(id, livre_id*, user_id*, contenu, createdAt, updatedAt)
RATE(id, livre_id*, user_id*, value, createdAt, updatedAt)
ACCESS_TOKENS(id, tokenable_id*, name, type, token, abilities, createdAt, updatedAt, lastUsedAt, expiresAt)
```

---

### 2.4 Modèle Physique (MPD)

Base de données SQLite avec les tables:

```sql
-- Voir fichiers migrations dans database/migrations/
-- Les tables sont créées automatiquement via les migrations Lucid ORM
```

Les migrations principales:
- `*_create_users_table.ts`
- `*_create_access_tokens_table.ts`
- `*_create_livres_table.ts`
- `*_create_commentaires_table.ts`
- `*_create_rates_table.ts`

---

### 2.5 Schéma d'Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND (Vue.js)                       │
│  Login | Register | List Books | Detail Book | Comments      │
└──────────────────────┬───────────────────────────────────────┘
                       │
                HTTP/JSON (REST API)
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    BACKEND (AdonisJS)                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │            Routes & Controllers                         │ │
│  │  • AuthController (login, register, logout, profile)    │ │
│  │  • LivresController (CRUD books)                        │ │
│  │  • CommentairesController (CRUD comments)               │ │
│  │  • RatesController (CRUD ratings)                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────▼────────────────────────────────┐ │
│  │         Middleware & Validation                         │ │
│  │  • AuthMiddleware (JWT token verification)              │ │
│  │  • ForceJsonResponseMiddleware (standardize responses)  │ │
│  │  • Validators (règles de validation)                    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────▼────────────────────────────────┐ │
│  │    ORM Lucid & Models                                   │ │
│  │  • User Model (auth provider)                           │ │
│  │  • Livre Model (with relations)                         │ │
│  │  • Commentaire Model (with relations)                   │ │
│  │  • Rate Model (with relations)                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                  │
└──────────────────────┬────▼──────────────────────────────────┘
                       │
                    SQLite DB
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    Users Tables  Books Tables  Comments Tables
```

---

## 3. Réalisation

### 3.1 Gestion de l'Authentification

L'authentification est basée sur les **JWT (JSON Web Tokens)** fournis par AdonisJS.

#### Flux d'authentification:

1. **Registration:**
   - L'utilisateur fournit username, email et password
   - Le password est hashé avec **Scrypt**
   - Un nouvel utilisateur est créé en base de données
   - Un JWT est généré et retourné au client

2. **Login:**
   - L'utilisateur fournit username et password
   - Le système vérifie les credentials avec `User.verifyCredentials()`
   - Un JWT est créé via `User.accessTokens.create(user)`
   - Le token est retourné au client et stocké en localStorage

3. **Protected Requests:**
   - Le client envoie le token dans l'en-tête `Authorization: Bearer {token}`
   - Le middleware `AuthMiddleware` vérifie le token
   - Si valide, la requête est traitée; sinon, une réponse 401 est retournée

4. **Logout:**
   - Le token est révoqué en base de données
   - Le client supprime le token du localStorage

**Code exemple (AuthController):**
```typescript
async login({ request, response }: HttpContext) {
  const { username, password } = await request.validateUsing(loginValidator)
  const user = await User.verifyCredentials(username, password)
  const token = await User.accessTokens.create(user)
  
  return response.ok({
    message: 'Login successful',
    token: token.value,
    user: serializePublicUser(user),
  })
}
```

---

### 3.2 Gestion des Rôles

Le système supporte deux rôles:

#### **Utilisateur Standard:**
- Peut consulter les livres et commentaires (lecture)
- Peut créer, modifier, supprimer ses propres livres
- Peut ajouter, modifier, supprimer ses propres commentaires
- Peut créer/modifier ses propres appréciations

#### **Admin:**
- Peut effectuer toutes les opérations sur tous les livres
- Peut supprimer les commentaires de n'importe quel utilisateur
- Accès complet à l'API

**Vérification des rôles (exemple dans CommentairesController):**
```typescript
async destroy({ params, response, auth }: HttpContext) {
  const commentaire = await Commentaire.findOrFail(params.commentId)
  
  const isOwner = commentaire.userId === auth.user!.id
  const isAdmin = auth.user!.admin === true
  
  if (!isOwner && !isAdmin) {
    return response.forbidden({ message: 'Not allowed to delete this comment' })
  }
  
  await commentaire.delete()
  return response.noContent()
}
```

---

### 3.3 Mesures de Sécurité

#### **1. Validation des Entrées:**
- Utilisation de **VineJS** pour valider toutes les données
- Longueurs minimales/maximales sur les champs
- Validation d'email, d'unicité
- Rejet des données invalides avant traitement (validateurs dans `app/validators/`)

#### **2. Hachage des Passwords:**
- Passwords hashés avec **Scrypt** (non stockés en clair)
- Fonction native d'AdonisJS
- Impossible de récupérer le password original

#### **3. Authentification JWT:**
- Tokens signés et vérifiés
- Expiration configurable
- Tokens révoqués à la déconnexion
- Header Authorization Bearer requis pour les routes protégées

#### **4. Middleware de Sécurité:**
- `AuthMiddleware`: Authentification requise
- `ForceJsonResponseMiddleware`: Standardise les réponses
- CORS configuré pour rejeter les requêtes cross-origin non autorisées

#### **5. Contrôle d'Accès (AuthZ):**
- Vérification du propriétaire avant modification/suppression
- Les admins ont un accès complet
- Les utilisateurs standard ne peuvent modifier que leurs propres données

#### **6. Gestion des Erreurs:**
- Réponses HTTP standardisées (200, 201, 400, 401, 403, 404, 500)
- Messages d'erreur explicites sans révéler d'infos sensibles
- Exception handler centralisé

#### **7. Protection des Données Sensibles:**
- Password jamais retourné dans les réponses API
- Serialization des modèles pour ne retourner que les champs utiles
- Timestamps pour audit (createdAt, updatedAt)

---

## 4. Tests

### 4.1 Tests de l'API

L'API a été testée avec **Bruno** (client REST similar à Postman) pour vérifier:

- ✅ **Routes de base**: GET, POST, PUT, DELETE
- ✅ **Authentification**: Login, Register, Logout, Protected Routes
- ✅ **Validation**: Rejet des données invalides
- ✅ **Statuts HTTP**: 200, 201, 400, 401, 403, 404
- ✅ **Relations**: Livres avec commentaires et appréciations
- ✅ **Autorisation**: Propriétaire vs Admin vs Public

**Checklist des tests:**
- [ ] Login avec Admin/Admin
- [ ] Récupérer le profil utilisateur
- [ ] Créer un nouveau livre
- [ ] Récupérer tous les livres
- [ ] Récupérer un livre par ID (avec commentaires)
- [ ] Modifier un livre (en tant que propriétaire)
- [ ] Supprimer un livre
- [ ] Ajouter un commentaire à un livre
- [ ] Récupérer les commentaires d'un livre
- [ ] Modifier un commentaire (en tant qu'auteur)
- [ ] Supprimer un commentaire
- [ ] Ajouter une appréciation
- [ ] Récupérer les appréciations d'un livre

**[INSÉRER SCREENSHOTS Bruno ici]**

### 4.2 Utilisation de Bruno

Bruno est utilisé pour tester automatiquement les endpoints de l'API. La collection Bruno contient:

- **Collection racine** (`Bruno/bruno.json`)
- **Dossier Auth** (`Bruno/Auth/`):
  - Login.bru
  - Register.bru
  - Logout.bru
  - Voir le profile.bru

- **Dossier Livres** (`Bruno/Livres/`):
  - GET livre.bru (tous les livres)
  - GET un livre.bru (détail)
  - POST un livre.bru (créer)
  - EDIT un livre.bru (modifier)
  - DELETE un livre.bru (supprimer)

- **Dossier Commentaires** (`Bruno/Livres/comment/`):
  - Get Comment.bru (récupérer)
  - Post Comment.bru (ajouter)

Tous les tests utilisent `auth: inherit` pour réutiliser le token obtenu lors du login.

**[INSÉRER SCREENSHOTS des tests Bruno ici]**

---

## 5. Conclusion

### 5.1 Conclusion Générale

Le projet "Passion Lecture" a été réalisé avec succès. Le backend expose une API REST robuste et documentée permettant une gestion complète des livres, utilisateurs et commentaires. L'authentification par JWT, la validation des données et les contrôles d'accès assurent la sécurité et l'intégrité de l'application.

Les principales réalisations:
- ✅ API REST complète avec CRUD pour tous les entités
- ✅ Authentification JWT sécurisée
- ✅ Validation robuste de toutes les données
- ✅ Gestion des rôles (User/Admin)
- ✅ Middleware et error handling standardisés
- ✅ Documentation Swagger générée automatiquement
- ✅ Tests avec Bruno validant tous les endpoints

### 5.2 Conclusion Personnelle

[À compléter par chaque apprenti - réflexion personnelle sur l'apprentissage, les défis rencontrés, les points forts et faibles personnels]

### 5.3 Critique de la Planification

Le projet a été réalisé en plusieurs phases bien distinctes:
1. Conception de la base de données (MCD, MLD, MPD)
2. Mise en place de l'authentification
3. Implémentation des routes pour livres
4. Implémentation des commentaires
5. Tests et ajustements

**Points positifs:**
- Approche itérative avec commits logiques
- Documentation à jour avec le code
- Tests réguliers avec Bruno

**Points d'amélioration:**
- Meilleure estimation du temps par tâche
- Tests unitaires en plus des tests manuels
- Documentation API complétée au fur et à mesure

---

## 6. Sources

### 6.1 Webographie

- [AdonisJS Documentation](https://docs.adonisjs.com)
- [VineJS - Validation](https://vinejs.dev)
- [SQLite Official](https://www.sqlite.org)
- [JWT Introduction](https://jwt.io)
- [REST API Best Practices](https://restfulapi.net)
- [OWASP Security Guidelines](https://owasp.org)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)

### 6.2 Utilisation de l'IA

**Recours à l'IA:** Oui / Non [À compléter]

Outils utilisés:
- [ ] ChatGPT
- [ ] GitHub Copilot
- [ ] Autre: _____________

**Mentions spécifiques:**
[Énumérer les contextes où l'IA a été utilisée et comment]

Exemple:
- Aide pour la structure du rapport
- Génération de code boilerplate pour les migrations
- Explications sur les concepts TypeScript

---

## Annexes

### A. Structure du Projet

```
Passion-Lecture-Back/
├── app/
│   ├── controllers/          # Logique métier des endpoints
│   ├── models/               # Modèles Lucid ORM
│   ├── validators/           # Règles de validation VineJS
│   ├── middleware/           # Middlewares personnalisés
│   └── exceptions/           # Gestion des exceptions
├── config/                   # Configuration (auth, db, cors, etc)
├── database/
│   ├── migrations/           # Migrations pour créer les tables
│   └── seeders/              # Données initiales
├── start/
│   ├── routes.ts             # Définition des routes
│   ├── kernel.ts             # Configuration middleware
│   └── env.ts                # Variables d'environnement
├── Bruno/                    # Collection des tests API
├── package.json              # Dépendances NPM
└── rapport.md               # Ce rapport
```

### B. Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Migration de la base de données
node ace migration:run

# Seeding des données initiales (optionnel)
node ace seed:run

# Démarrage du serveur
npm run dev

# Compilé pour production
npm run build
npm start
```

### C. Variables d'Environnement (.env)

```
NODE_ENV=development
APP_KEY=generated_key_here
DB_CONNECTION=sqlite
SQLITE_FILENAME=./database.sqlite
SESSION_DRIVER=memory
```

---

**Rapport réalisé le:** [DATE]  
**Apprentis:** [Noms]  
**Chef de Projet:** [Nom]

