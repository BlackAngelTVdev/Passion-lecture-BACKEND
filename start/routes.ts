import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swaggerConfig from '#config/swagger'

const LivresController = () => import('#controllers/livres_controller')
const AuthController = () => import('#controllers/auth_controller')

// Routes Swagger
router.get('/swagger.json', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swaggerConfig)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger.json', swaggerConfig)
})

// Public users endpoint for the frontend
router.get('/users', [AuthController, 'users'])

router.get('/', ({ response }) => {
  return response.redirect().toPath('/docs')
})
// Authentication routes (public)
router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])

// Protected routes (require authentication)
router
  .group(() => {
    // Auth routes
    router.post('/logout', [AuthController, 'logout'])
    // Books routes
  })
  .middleware(() => import('#middleware/auth_middleware'))
  router.get('/users/:id', [AuthController, 'userDetail'])
  router.resource('books', LivresController).apiOnly()