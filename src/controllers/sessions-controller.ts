import z from 'zod'
import jwt from 'jsonwebtoken'
import { compare } from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { FastifyRequest, FastifyReply } from 'fastify'

export class SessionsController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const sessionsSchema = z.object({
      email: z.email(),
      password: z.string(),
    })

    const { email, password } = sessionsSchema.parse(request.body)

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return reply.status(401).send({
        message: 'Credenciais inválidas',
      })
    }

    const passwordIsValid = await compare(password, user.password_hash)

    if (!passwordIsValid) {
      return reply.status(401).send({
        message: 'Credenciais inválidas',
      })
    }

    const token = jwt.sign({}, process.env.JWT_SECRET!, {
      subject: user.id,
      expiresIn: '7d',
    })

    return reply.status(200).send({ token })
  }
}
