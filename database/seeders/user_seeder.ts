import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const users = [
      {
        username: 'Admin',
        email: 'admin@example.com',
        password: 'Admin',
        admin: true,
      },
      {
        username: 'Test',
        email: 'test@example.com',
        password: '1234',
        admin: false,
      },
    ]
    for (const userPayload of users) {
      const existingUser = await User.findBy('username', userPayload.username)

      if (existingUser) {
        existingUser.merge(userPayload)
        await existingUser.save()
      } else {
        await User.create(userPayload)
      }
    }
  }
}
