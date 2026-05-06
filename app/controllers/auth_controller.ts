import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
// Assuming you created a validator: 'node ace make:validator auth'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Login user and return token
   */
  async login({ request, response }: HttpContext) {
    const { username, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(username, password)
      const token = await User.accessTokens.create(user)

      return response.ok({
        message: 'Login successful',
        token: token.value, // Just the string token
        user: user.serialize(), // Uses the serialize hook in your model
      })
    } catch (error) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }

  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create(payload)
    const token = await User.accessTokens.create(user)

    return response.created({
      message: 'User registered successfully',
      token: token.value,
      user: user.serialize(),
    })
  }

  /**
   * Logout user (revoke current token)
   */
  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    // Get the specific token used for this request
    const token = auth.user!.currentAccessToken

    await User.accessTokens.delete(user, token.identifier)

    return response.ok({ message: 'Logout successful' })
  }

  /**
   * Get current user profile
   */

  async users({ response }: HttpContext) {
    const users = await User.query().select('id', 'username', 'admin', 'created_at')
    return response.ok(users)
  }
  async userDetail({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.ok({
      id: user.id,
      username: user.username,
      admin: user.admin,
      createdAt: user.createdAt,
    })
  }
}
