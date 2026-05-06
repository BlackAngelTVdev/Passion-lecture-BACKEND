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
        imageCouverture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi9JaaJreG5SMRDLEnrvcXPfg7tRGonR6EFA&s',
        userId: 1,
      },
      {
        titre: '1984',
        auteur: 'George Orwell',
        categorie: 'Dystopie',
        editeur: 'Seuil',
        epub: '1984.epub',
        resume: 'Big Brother vous regarde.',
        imageCouverture: 'https://cdn.kobo.com/book-images/c9472126-7f96-402d-ba57-5ba4c0f4b238/1200/1200/False/nineteen-eighty-four-1984-george.jpg',
        nbPages: 328,
        userId: 1,
      },
    ])
  }
}
