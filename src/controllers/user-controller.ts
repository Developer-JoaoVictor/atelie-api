import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

export class UserController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const userSchema = z.object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(6),
    })

    const { name, email, password } = userSchema.parse(request.body)

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userExists) {
      return reply.status(409).send({
        message: 'E-mail já cadastrado',
      })
    }

    const password_hash = await hash(password, 6)

    await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    })

    return reply.status(201).send({
      message: 'Usuário criado com sucesso!',
    })
  }
}
