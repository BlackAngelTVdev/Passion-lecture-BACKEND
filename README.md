# 🚀 Passion Lecture Backend
![Stars](https://img.shields.io/github/stars/BlackAngelTVdev/Passion-lecture-BACKEND?style=for-the-badge&color=yellow)
![Commits](https://img.shields.io/github/commit-activity/m/BlackAngelTVdev/Passion-lecture-BACKEND?style=for-the-badge&color=blue)
![Issues](https://img.shields.io/github/issues/BlackAngelTVdev/Passion-lecture-BACKEND?style=for-the-badge&color=orange)
![Forks](https://img.shields.io/github/forks/BlackAngelTVdev/Passion-lecture-BACKEND?style=for-the-badge&color=808080)
![Last Commit](https://img.shields.io/github/last-commit/BlackAngelTVdev/Passion-lecture-BACKEND?style=for-the-badge&color=blue)

> **Une API backend AdonisJS pour gérer des livres, des commentaires, des notes et l’authentification des utilisateurs.**

---

## 🧐 Aperçu

Cette API alimente l’application Passion Lecture avec une gestion complète des livres, des commentaires, des notes, des utilisateurs et de l’authentification par token. Elle expose aussi une documentation Swagger pour tester les routes rapidement.

## ✨ Fonctionnalités

- ✅ **Authentification** : inscription, connexion, déconnexion et profil utilisateur.
- ✅ **Livres** : création, modification, suppression et consultation des fiches livre.
- ✅ **Commentaires** : ajout, lecture, mise à jour et suppression des commentaires.
- ✅ **Notes** : création, mise à jour et suppression des évaluations de livres.
- ✅ **Documentation API** : Swagger disponible directement depuis l’application.

## 🛠 Tech Stack

| Technologie | Usage |
| :--- | :--- |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Langage principal pour un code robuste et typé |
| ![AdonisJS](https://img.shields.io/badge/AdonisJS-5A45FF?style=flat-square&logo=adonisjs&logoColor=white) | Framework backend (v6) utilisé pour l'architecture MVC et l'API |
| ![Lucid ORM](https://img.shields.io/badge/Lucid-2F855A?style=flat-square) | Gestionnaire de base de données et patterns Active Record |
| ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black) | Documentation interactive de l'API |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) | Base de données relationnelle pour la production |
| ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white) | Base de données locale pour le développement et les tests |

## 🚀 Installation & Lancement

1. **Cloner le projet**
	```bash
	git clone https://github.com/BlackAngelTVdev/Passion-lecture-BACKEND.git
	cd Passion-lecture-BACKEND
	```

2. **Installer les dépendances**
	```bash
	npm install
	```

3. **Configurer les variables d'environnement**
	Créez un fichier `.env` à la racine à partir de votre configuration locale, puis renseignez au minimum les variables nécessaires à AdonisJS, la base de données et l’authentification.

	Exemple minimal:
	```env
	NODE_ENV=development
	PORT=3333
	HOST=0.0.0.0
	APP_KEY=your_generated_app_key
	DB_CONNECTION=mysql
	DB_HOST=127.0.0.1
	DB_PORT=3306
	DB_USER=root
	DB_PASSWORD=
	DB_DATABASE=passion_lecture
	```

4. **Créer la base et les données initiales**
	```bash
	node ace migration:run
	node ace db:seed
	```

5. **Lancer l'application en développement**
	```bash
	npm run dev
	```

6. **Lancer en production**
	```bash
	npm run build
	npm start
	```

## 📖 Utilisation

Une fois le serveur lancé, l’API est disponible sur `http://localhost:3333` par défaut. La documentation Swagger est exposée sur `/docs` et le fichier OpenAPI sur `/swagger.json`.

Exemples de routes utiles:

- `POST /login` pour récupérer un token.
- `GET /books` pour lister les livres.
- `POST /books/:id/comments` pour ajouter un commentaire authentifié.
- `POST /books/:bookId/rates` pour noter un livre authentifié.

## 🤝 Contribution

1. Forkez le projet.
2. Créez votre branche: `git checkout -b feature/AmazingFeature`.
3. Committez vos changements: `git commit -m 'Add some AmazingFeature'`.
4. Poussez la branche: `git push origin feature/AmazingFeature`.
5. Ouvrez une Pull Request.

## 👤 Auteur

**BlackAngelTVdev**
![Follow](https://img.shields.io/github/followers/BlackAngelTVdev?label=Follow%20Me&style=social)

**Gianmarco-Ruberti**
![Follow](https://img.shields.io/github/followers/Gianmarco-Ruberti?label=Follow%20Me&style=social)

---

## 📄 Licence

Ce projet est sous licence:
![GitHub License](https://img.shields.io/github/license/BlackAngelTVdev/Passion-lecture-BACKEND?style=flat-square&color=blue)

### 🧑‍💻 Contributors

Merci à toutes les personnes qui contribuent au projet.

[![Contributors](https://contrib.rocks/image?repo=BlackAngelTVdev/Passion-lecture-BACKEND)](https://github.com/BlackAngelTVdev/Passion-lecture-BACKEND/graphs/contributors)
