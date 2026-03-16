import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/user-controller'

const userController = new UserController()

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', (request, reply) => userController.create(request, reply))
}
