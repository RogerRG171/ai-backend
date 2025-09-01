import { fastifyCors } from '@fastify/cors'
import fastify from 'fastify'
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env.ts'
import { getRoomsRoute } from './http/routes/get-rooms.ts'
import { createRoomRoute } from './http/routes/create-room.ts'
import { getRoomQuestionsRoute } from './http/routes/get-room-questions.ts'
import { createQuestionRoute } from './http/routes/create-question.ts'

if (!env) {
	throw new Error(' .env not found')
}

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.register(fastifyCors, {
	origin: 'http://localhost:5173',
})

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.register(getRoomsRoute)
server.register(createRoomRoute)
server.register(getRoomQuestionsRoute)
server.register(createQuestionRoute)

server.get('/health', (req, reply) => {
	reply.status(200).send('OK')
})

const port = env.PORT

server.listen({ port, host: '0.0.0.0' }, (err, address) => {
	if (err) {
		server.log.error(err)
		process.exit(1)
	}
	console.log(`Server listening on ${address}`)
})
