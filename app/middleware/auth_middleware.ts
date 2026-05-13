import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      await ctx.auth.authenticate()
      return next()
    } catch (error) {
      return ctx.response.unauthorized({
        errors: [
          {
            message: 'Accès refusé. Vous devez être connecté pour voir cette ressource.',
            code: 'E_UNAUTHORIZED'
          }
        ]
      })
    }
  }
}