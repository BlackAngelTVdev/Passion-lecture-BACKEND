import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Livre from '#models/livre'
import Commentaire from '#models/commentaire'
import User from '#models/user'

export default class extends BaseSeeder {
  public async run() {
    // On récupère l'admin qu'on vient de créer dans le seeder précédent
    const admin = await User.findByOrFail('username', 'Admin')

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

    await Commentaire.createMany([
      {
        contenu: "Un chef-d'œuvre absolu !",
        userId: admin.id,
        livreId: livres[0].id,
      },
      {
        contenu: 'Un peu court, mais très intense.',
        userId: admin.id,
        livreId: livres[0].id,
      },
    ])
  }
}
