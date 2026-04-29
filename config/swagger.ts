// config/swagger.ts

export default {
  uiUrl: 'docs',
  specUrl: 'swagger.json',
  title: 'Passion Lecture API',
  version: '1.0.0',
  description: "Documentation de l'API Backend",
  tagIndex: 2,
  snakeCase: true,
  path: 'app/controllers',
  ignore: [],
  common: {
    parameters: {},
    headers: {},
  },
}
