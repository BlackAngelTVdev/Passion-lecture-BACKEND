import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Livre from '#models/livre'
import Commentaire from '#models/commentaire'
import User from '#models/user'

export default class extends BaseSeeder {
  public async run() {
    // 1. On récupère un utilisateur existant pour lier les commentaires
    const user = await User.first()

    if (!user) {
      console.log('Veuillez créer un utilisateur avant de seed les livres.')
      return
    }

    // 2. Création des Livres
    const livres = await Livre.createMany([
      {
        titre: "L'Étranger",
        auteur: 'Albert Camus',
        categorie: 'Classique',
        editeur: 'Gallimard',
        epub: 'etranger.epub',
        resume: "Une histoire sur l'absurde.",
        nbPages: 159,
      },
      {
        titre: '1984',
        auteur: 'George Orwell',
        categorie: 'Dystopie',
        editeur: 'Seuil',
        epub: '1984.epub',
        resume: 'Big Brother vous regarde.',
        nbPages: 328,
      },
    ])

    // 3. Création des Commentaires pour le premier livre
    await Commentaire.createMany([
      {
        contenu: "Un chef-d'œuvre absolu !",
        userId: user.id,
        livreId: livres[0].id,
      },
      {
        contenu: 'Un peu court, mais très intense.',
        userId: user.id,
        livreId: livres[0].id,
      },
    ])
  }
}
