/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const LivresController = () => import('#controllers/livres_controller')

router.resource('books', LivresController).apiOnly()
