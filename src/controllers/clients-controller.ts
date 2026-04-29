import { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma'

export class ClientsController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const clientSchema = z.object({
      name: z.string().min(1),
      phone: z.string().min(8),
    })

    const { name, phone } = clientSchema.parse(request.body)

    const client = await prisma.client.create({
      data: {
        name,
        phone,
        user_id: request.user.id,
      },
    })

    return reply.status(201).send({ client })
  }
}
