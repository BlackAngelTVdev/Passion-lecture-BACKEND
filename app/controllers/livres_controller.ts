import type { HttpContext } from '@adonisjs/core/http'
import Livre from '#models/livre'

export default class LivresController {
  async index({ response }: HttpContext) {
    const livres = await Livre.all()
    return response.ok(livres)
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()
    const livre = await Livre.create(data)
    return response.created(livre)
  }

  async show({ params, response }: HttpContext) {
    const livre = await Livre.findOrFail(params.id)
    return response.ok(livre)
  }

  async update({ params, request, response }: HttpContext) {
    const livre = await Livre.findOrFail(params.id)
    const data = request.all()

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
