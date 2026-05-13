import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'livres'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table.string('titre').notNullable()
      table.string('resume')
      table.integer('nb_pages')
      table.string('extrait_pdf')
      table.string('image_couverture')
      table.string('categorie').notNullable()
      table.string('editeur').notNullable()
      table.string('auteur').notNullable()
      table.string('epub')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
