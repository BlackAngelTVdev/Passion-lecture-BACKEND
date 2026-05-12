import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      // Authenticate using the default 'api' guard
      await ctx.auth.authenticate()
      return next()
    } catch (error) {
      return ctx.response.unauthorized({
        message: 'Authentication required',
        error: 'No valid token provided',
      })
    }
  }
}
