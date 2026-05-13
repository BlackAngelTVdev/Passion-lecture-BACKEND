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
![alt text](doc/image.png)

### 2.3 Modèle Logique (MLD)

![alt text](doc/image-1.png)

---

### 2.4 Modèle Physique (MPD)

Base de données SQLite avec les tables:

```sql
-- 1. Création de la Database
CREATE DATABASE MonSuperProjet;
USE MonSuperProjet;

-- 2. Table des Catégories (Simple et indépendante)
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL
);

-- 3. Table des Utilisateurs
CREATE TABLE utilisateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pseudo VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table des Articles (Avec relations FK)
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT,
    auteur_id INT,
    categorie_id INT,
    -- Relation : Un article est écrit par un utilisateur
    CONSTRAINT fk_auteur FOREIGN KEY (auteur_id) 
        REFERENCES utilisateurs(id) ON DELETE CASCADE,
    -- Relation : Un article appartient à une catégorie
    CONSTRAINT fk_categorie FOREIGN KEY (categorie_id) 
        REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE users(
   id INT AUTO_INCREMENT,
   pseudo VARCHAR(50) NOT NULL,
   email VARCHAR(100) NOT NULL,
   password VARCHAR(255) NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY(id),
   UNIQUE(email)
);

CREATE TABLE books(
   id INT AUTO_INCREMENT,
   titre VARCHAR(255) NOT NULL,
   resume TEXT,
   nb_pages INT,
   extrait_pdf VARCHAR(255),
   image_couverture VARCHAR(255),
   auteur_nom VARCHAR(100),
   auteur_prenom VARCHAR(100),
   categorie VARCHAR(255),
   editeur VARCHAR(100),
   annee_edition INT,
   user_id INT,
   PRIMARY KEY(id),
   FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE reviews(
   id INT AUTO_INCREMENT,
   note INT CHECK(note BETWEEN 0 AND 5),
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   book_id INT,
   user_id INT,
   PRIMARY KEY(id),
   FOREIGN KEY(book_id) REFERENCES books(id),
   FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE Comment(
   id INT AUTO_INCREMENT,
   commentaire TEXT,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   id_user_id INT,
   id_book_id INT,
   PRIMARY KEY(id),
   FOREIGN KEY(id_user_id) REFERENCES users(id),
   FOREIGN KEY(id_book_id) REFERENCES books(id)
);

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
└──────────────────────────┬───────────────────────────────────┘
                           │
                    HTTP/JSON (REST API)
                           │
┌──────────────────────────▼───────────────────────────────────┐
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
│                            ▼                                 │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             DB
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
   - L'utilisateur fournit username et password
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

L'API a été testée avec **Bruno** pour vérifier:

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


### 4.2 Utilisation de Bruno

Bruno est utilisé pour tester les endpoints de l'API. La collection Bruno contient:


![alt text](doc/image3.png)

(/!\ A Mettre a jour)

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


Exemple:
- Aide pour la structure du rapport
- Génération de code boilerplate pour les migrations
- Explications sur les concepts TypeScript

---

## Annexes


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

```js
NODE_ENV=development
APP_KEY=generated_key_here
DB_CONNECTION=mysql
```

---

**Rapport réalisé le:** 12/05/2026  
**Apprentis:** M. Rochat, M. Ruberti  
**Chef de Projet:** M. Mveng

