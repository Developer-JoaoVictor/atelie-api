import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/user-controller'
import { SessionsController } from '../controllers/sessions-controller'

const userController = new UserController()
const sessionsController = new SessionsController()

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', (request, reply) => userController.create(request, reply))
  app.post('/sessions', (request, reply) =>
    sessionsController.create(request, reply),
  )
}
