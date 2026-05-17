import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/user-controller'
import { SessionsController } from '../controllers/sessions-controller'
import { authenticated } from '../middleware/authenticated'
import { ClientsController } from '../controllers/clients-controller'
import { OrdersController } from '../controllers/orders-controller'

const userController = new UserController()
const sessionsController = new SessionsController()
const clientsController = new ClientsController()
const ordersController = new OrdersController()

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', (request, reply) => userController.create(request, reply))
  app.post('/sessions', (request, reply) =>
    sessionsController.create(request, reply),
  )
  app.post('/clients', { preHandler: authenticated }, (request, reply) => {
    clientsController.create(request, reply)
  })
  app.get('/clients', { preHandler: authenticated }, (request, reply) => {
    clientsController.list(request, reply)
  })
  app.post('/orders', { preHandler: authenticated }, (request, reply) => {
    ordersController.create(request, reply)
  })
}
