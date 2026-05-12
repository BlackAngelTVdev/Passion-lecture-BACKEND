import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Commentaire from '#models/commentaire'
import Rate from '#models/rate'
import User from '#models/user' // N'oublie pas l'import

export default class Livre extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare userId: number

  @column()
  declare titre: string

  @column()
  declare resume: string | null

  @column()
  declare nbPages: number | null

  @column()
  declare extraitPdf: string | null

  @column()
  declare imageCouverture: string | null

  @column()
  declare categorie: string

  @column()
  declare editeur: string

  @column()
  declare auteur: string

  @column()
  declare epub: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relations
   */

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Commentaire, {
    foreignKey: 'livreId',
  })
  declare commentaires: HasMany<typeof Commentaire>

  @hasMany(() => Rate)
  declare rates: HasMany<typeof Rate>
}
