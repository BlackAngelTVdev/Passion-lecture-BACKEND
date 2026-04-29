import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Commentaire from '#models/commentaire'

export default class Livre extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

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
  @hasMany(() => Commentaire)
  declare commentaires: HasMany<typeof Commentaire>
}
