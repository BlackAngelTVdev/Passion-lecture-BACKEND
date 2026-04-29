import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Commentaire from '#models/commentaire'
import Livre from '#models/livre'
import User from '#models/user'

export default class extends BaseSeeder {
  public async run() {
    // On récupère les dépendances nécessaires
    const admin = await User.findByOrFail('username', 'Admin')
    const livre = await Livre.findByOrFail('titre', "L'Étranger")

    await Commentaire.createMany([
      {
        contenu: "Un chef-d'œuvre absolu !",
        userId: admin.id,
        livreId: livre.id,
      },
      {
        contenu: 'Un peu court, mais très intense.',
        userId: admin.id,
        livreId: livre.id,
      },
    ])
  }
}
