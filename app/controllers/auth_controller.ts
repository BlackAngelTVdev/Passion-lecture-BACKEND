import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
// Assuming you created a validator: 'node ace make:validator auth'
import { registerValidator, loginValidator } from '#validators/auth'

const serializePublicUser = (user: User) => {
  const serialized = user.serialize() as {
    id: number
    username: string | null
    admin?: boolean | number
    createdAt?: string | null
  }

  return {
    id: serialized.id,
    username: serialized.username,
    admin: Boolean(serialized.admin),
    createdAt: serialized.createdAt ?? null,
  }
}

const resolveTokenValue = (token: any) => {
  if (typeof token?.value === 'string') {
    return token.value
  }

  if (token?.value && typeof token.value === 'object' && 'release' in token.value) {
    return token.value.release()
  }

  return ''
}

const buildAuthResponse = (user: User, token: any) => ({
  token: resolveTokenValue(token),
  accessToken: resolveTokenValue(token),
  user: serializePublicUser(user),
})

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
        ...buildAuthResponse(user, token),
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
      ...buildAuthResponse(user, token),
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

  async profile({ auth, response }: HttpContext) {
    await auth.authenticate()
    return response.ok(serializePublicUser(auth.user!))
  }

  /**
   * Get current user profile
   */

  async users({ response }: HttpContext) {
    const users = await User.query().select('id', 'username', 'admin', 'created_at')
    const publicUsers = users.map((user) => serializePublicUser(user))
    return response.ok(publicUsers)
  }
  async userDetail({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.ok({
      id: user.id,
      username: user.username,
      admin: Boolean(user.admin),
      createdAt: user.createdAt?.toISO() ?? null,
    })
  }
}
