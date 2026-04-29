import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
const users = [{
      username: 'Admin',
      password: 'Admin',
      admin: true,
    },{
      username: 'Test',
      password: '1234',
      admin: false,
    }
  ]

    await User.createMany(users)  }
}