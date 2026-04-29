import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'commentaires'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('contenu').notNullable()
      // Relations
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('livre_id').unsigned().references('id').inTable('livres').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
