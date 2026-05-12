import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user' // Utilise le alias #models
import Livre from '#models/livre' // Utilise le alias #models

export default class Commentaire extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contenu: string

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'livre_id' })
  declare livreId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare auteur: BelongsTo<typeof User>

  @belongsTo(() => Livre, {
    foreignKey: 'livreId',
  })
  declare livre: BelongsTo<typeof Livre>
}
