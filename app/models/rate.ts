import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Livre from '#models/livre'

export default class Rate extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare value: number

  @column()
  declare userId: number

  @column()
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
