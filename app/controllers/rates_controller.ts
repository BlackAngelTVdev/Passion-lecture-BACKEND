import type { HttpContext } from '@adonisjs/core/http'
import Rate from '#models/rate'
import Livre from '#models/livre'

export default class RatesController {
  /**
   * Get all ratings for a book
   */
  async index({ params, response }: HttpContext) {
    const livre = await Livre.findOrFail(params.bookId)
    const rates = await livre.related('rates').query()
    return response.ok(rates)
  }

  /**
   * Create or update a rating for a book
   */
  async store({ params, request, auth, response }: HttpContext) {
    // Ensure the request is authenticated
    try {
      await auth.authenticate()
    } catch (err) {
      return response.unauthorized({ message: 'Authentification requise' })
    }

    const rawValue = request.input('value')
    const value = Number(rawValue)
    const userId = (auth.user as any)?.id

    if (!userId) {
      return response.unauthorized({ message: 'Authentification requise' })
    }

    if (!Number.isFinite(value) || value < 1 || value > 5) {
      return response.badRequest({ message: 'Valeur de note invalide' })
    }

    const livre = await Livre.findOrFail(params.bookId)

    // Check if user has already rated this book
    const existingRate = await Rate.query()
      .where('livre_id', livre.id)
      .where('user_id', userId)
      .first()

    try {
      if (existingRate) {
        existingRate.value = value
        await existingRate.save()
        await existingRate.load('user')
        return response.ok(existingRate)
      }

      // Create new rating
      const rate = await Rate.create({
        value,
        userId,
        livreId: livre.id,
      })

      await rate.load('user')
      return response.created(rate)
    } catch (err) {
      console.error('RatesController.store error:', err)
      return response.internalServerError({ message: 'Erreur serveur lors de l\'enregistrement de la note' })
    }
  }

  /**
   * Show individual rating
   */
  async show({ params, response }: HttpContext) {
    const rate = await Rate.findOrFail(params.id)
    return response.ok(rate)
  }

  /**
   * Update a rating
   */
  async update({ params, request, auth, response }: HttpContext) {
    const rate = await Rate.findOrFail(params.id)
    const userId = (auth.user as any)?.id

    if (!userId || rate.userId !== userId) {
      return response.unauthorized({ message: 'Pas autorisé' })
    }

    const value = request.input('value')
    if (typeof value !== 'number' || value < 1 || value > 5) {
      return response.badRequest({ message: 'Valeur de note invalide' })
    }

    rate.value = value
    await rate.save()
    return response.ok(rate)
  }

  /**
   * Delete a rating
   */
  async destroy({ params, auth, response }: HttpContext) {
    const rate = await Rate.findOrFail(params.id)
    const userId = (auth.user as any)?.id

    if (!userId || rate.userId !== userId) {
      return response.unauthorized({ message: 'Pas autorisé' })
    }

    await rate.delete()
    return response.ok({ message: 'Notation supprimée' })
  }
}