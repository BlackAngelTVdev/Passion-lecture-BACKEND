import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  public async run() {
    // L'ordre est CRITIQUE ici
    await new (await import('./user_seeder.js')).default(this.client).run()
    await new (await import('./livre_et_commentaire_seeder.js')).default(this.client).run()
  }
}
