import app from '@adonisjs/core/services/app'

export default {
  uiUrl: 'docs',
  specUrl: 'swagger.json',
  title: 'Passion Lecture API',
  version: 'Bêt@ 0.1.8',
  description: "Documentation de l'API Backend",
  tagIndex: 2,
  snakeCase: true,
  path: app.makePath(),
  ignore: [],
  common: {
    parameters: {},
    headers: {},
  },
}