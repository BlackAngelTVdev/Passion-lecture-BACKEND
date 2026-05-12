import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swaggerConfig from '#config/swagger'

const LivresController = () => import('#controllers/livres_controller')
const AuthController = () => import('#controllers/auth_controller')
const CommentairesController = () => import('#controllers/commentaires_controller')

// Routes Swagger
router.get('/swagger.json', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swaggerConfig)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger.json', swaggerConfig)
})

// Public users endpoint for the frontend
router.get('/users', [AuthController, 'users'])
router.get('/users/:id', [AuthController, 'userDetail'])

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
    router.get('/profile', [AuthController, 'profile'])

    // Books routes
  })
  .middleware(() => import('#middleware/auth_middleware'))

router.resource('books', LivresController).apiOnly()
    router.post('/books/:id/comments', [CommentairesController, 'store'])
    router.get('/books/:id/comments', [CommentairesController, 'index'])
    router.get('/books/:id/comments/:commentId', [CommentairesController, 'show'])
    router.put('/books/:id/comments/:commentId', [CommentairesController, 'update'])
    router.delete('/books/:id/comments/:commentId', [CommentairesController, 'destroy'])