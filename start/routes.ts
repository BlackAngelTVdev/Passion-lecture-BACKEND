import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swaggerConfig from '#config/swagger'

const LivresController = () => import('#controllers/livres_controller')
const AuthController = () => import('#controllers/auth_controller')
const CommentairesController = () => import('#controllers/commentaires_controller')
const RatesController = () => import('#controllers/rates_controller')

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

// Public routes for reading books and ratings
router.get('/books', [LivresController, 'index'])
router.get('/books/:id', [LivresController, 'show'])
router.get('/books/:id/comments', [CommentairesController, 'index'])
router.get('/books/:bookId/rates', [RatesController, 'index'])

// Protected routes (require authentication)
router
  .group(() => {
    // Auth routes
    router.post('/logout', [AuthController, 'logout'])
    router.get('/profile', [AuthController, 'profile'])

    // Books write operations
    router.post('/books', [LivresController, 'store'])
    router.put('/books/:id', [LivresController, 'update'])
    router.delete('/books/:id', [LivresController, 'destroy'])


  })
  .middleware([() => import('#middleware/auth_middleware')])
      // Comments operations
    router.post('/books/:id/comments', [CommentairesController, 'store'])
    router.get('/books/:id/comments/:commentId', [CommentairesController, 'show'])
    router.put('/books/:id/comments/:commentId', [CommentairesController, 'update'])
    router.delete('/books/:id/comments/:commentId', [CommentairesController, 'destroy'])

    // Rating routes
    router.post('/books/:bookId/rates', [RatesController, 'store'])
    router.get('/books/:bookId/rates/:id', [RatesController, 'show'])
    router.put('/books/:bookId/rates/:id', [RatesController, 'update'])
    router.delete('/books/:bookId/rates/:id', [RatesController, 'destroy'])