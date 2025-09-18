import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
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
import { uploadAudioRoute } from './http/routes/upload-audio.ts'

if (!env) {
	throw new Error(' .env not found')
}

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.register(fastifyCors, {
	origin: env.FRONTEND_URL,
})

server.register(fastifyMultipart)

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.get('/health', (request, reply) => {
	return { status: 'ok' }
})

server.register(getRoomsRoute)
server.register(createRoomRoute)
server.register(getRoomQuestionsRoute)
server.register(createQuestionRoute)
server.register(uploadAudioRoute)

export { server }
