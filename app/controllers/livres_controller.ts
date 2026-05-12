import type { HttpContext } from '@adonisjs/core/http'
import Livre from '#models/livre'
import { createLivreValidator, updateLivreValidator } from '#validators/livre'

export default class LivresController {
  async index({ response }: HttpContext) {
    const livres = await Livre.query()
      .preload('commentaires', (commentQuery) => {
        commentQuery.preload('auteur', (userQuery) => {
          userQuery.select(['id', 'username'])
        })
      })
      .preload('rates')
    return response.ok(livres)
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createLivreValidator)

    // Attach authenticated user id server-side to avoid relying on client-provided value
    if (auth.user) {
      // Ensure we write the expected property name for the model
      // data may come with userId (camelCase) or user_id depending on client
      data.userId = (auth.user as any).id
    }

    const livre = await Livre.create(data)
    return response.created(livre)
  }

  async show({ params, response }: HttpContext) {
    const livre = await Livre.query()
      .where('id', params.id)
      .preload('commentaires', (commentQuery) => {
        commentQuery.preload('auteur', (userQuery) => {
          userQuery.select(['id', 'username'])
        })
      })
      .preload('rates')
      .firstOrFail()
    return response.ok(livre)
  }

  async update({ params, request, response }: HttpContext) {
    const livre = await Livre.findOrFail(params.id)
    const data = await request.validateUsing(updateLivreValidator)

    livre.merge(data)
    await livre.save()

    return response.ok(livre)
  }

  async destroy({ params, response }: HttpContext) {
    const livre = await Livre.findOrFail(params.id)
    await livre.delete()

    return response.noContent()
  }
}
