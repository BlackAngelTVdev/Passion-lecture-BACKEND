import Rate from '#models/rate'
import User from '#models/user'
import Livre from '#models/livre'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
async run() 
  {
  const user = await User.findBy('username', 'Admin')
  const livre = await Livre.query().first()

  if (!user || !livre) {
    throw new Error('Missing User or Livre record in rate seeder')
  }

  await Rate.createMany([
    {
      value: 5,
      userId: user.id,
      livreId: livre.id,
    },
    {
      value: 4,
      userId: user.id,
      livreId: livre.id,
    },
  ])
  }
}
