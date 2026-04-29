import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Livre from '#models/livre'

export default class extends BaseSeeder {
  public async run() {
    await Livre.createMany([
      {
        titre: "L'Étranger",
        auteur: 'Albert Camus',
        categorie: 'Classique',
        editeur: 'Gallimard',
        epub: 'etranger.epub',
        resume: "Une histoire sur l'absurde.",
        nbPages: 159,
        userId: 1,
      },
      {
        titre: '1984',
        auteur: 'George Orwell',
        categorie: 'Dystopie',
        editeur: 'Seuil',
        epub: '1984.epub',
        resume: 'Big Brother vous regarde.',
        nbPages: 328,
        userId: 1,
      },
    ])
  }
}
