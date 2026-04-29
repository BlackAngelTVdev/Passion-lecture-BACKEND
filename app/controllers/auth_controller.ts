import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  /**
   * Login user and return JWT token
   */
  async login({ request, response }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])

    try {
      const user = await User.verifyCredentials(username, password)
      const token = await User.accessTokens.create(user)

      return response.ok({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          admin: user.admin,
        },
        token: token.toJSON(),
      })
    } catch (error) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }

  /**
   * Logout user (revoke token)
   */
  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, auth.user!.currentAccessToken.identifier)

    return response.ok({ message: 'Logout successful' })
  }

  /**
   * Get current user profile
   */
  async profile({ auth, response }: HttpContext) {
    const user = auth.user!

    return response.ok({
      id: user.id,
      username: user.username,
      email: user.email,
      admin: user.admin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }

  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    const { username, email, password } = request.only(['username', 'email', 'password'])

    // Basic validation
    if (!username || !email || !password) {
      return response.badRequest({ message: 'Username, email and password are required' })
    }

    if (password.length < 8) {
      return response.badRequest({ message: 'Password must be at least 8 characters long' })
    }
    
    // Check if user already exists
    const existingUser = await User.findBy('username', username)
    if (existingUser) {
      return response.badRequest({ message: 'Username already exists' })
    }

    const existingEmail = await User.findBy('email', email)
    if (existingEmail) {
      return response.badRequest({ message: 'Email already exists' })
    }

    const user = await User.create({
      username,
      email,
      password,
      admin: false,
    })

    const token = await User.accessTokens.create(user)

    return response.created({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        admin: user.admin,
      },
      token: token.toJSON(),
    })
  }
}