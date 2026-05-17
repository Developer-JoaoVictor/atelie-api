import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma'

export class OrdersController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const orderSchema = z.object({
      description: z.string().min(3),
      price: z.number(),
      delivery_date: z.coerce.date(),
      client_id: z.string(),
    })

    const { description, price, delivery_date, client_id } = orderSchema.parse(
      request.body,
    )

    const client = await prisma.client.findFirst({
      where: { id: client_id },
    })

    if (!client) {
      return reply.status(404).send({ message: 'Não encontrado' })
    }

    if (client.user_id !== request.user.id) {
      return reply.status(403).send({ message: 'Não autorizado' })
    }

    const order = await prisma.order.create({
      data: {
        description,
        price,
        status: 'RECEVEID',
        client_id,
        delivery_date,
      },
    })

    return reply.status(201).send(order)
  }
}
