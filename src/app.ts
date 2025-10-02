import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
import fastify from 'fastify'
import {
	jsonSchemaTransform,
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
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { metricsPlugin } from './observability/metrics.ts'

if (!env) {
	throw new Error(' .env not found')
}

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.register(fastifyCors, {
	origin: env.FRONTEND_URL,
})

if (env.NODE_ENV === 'development') {
	server.register(fastifySwagger, {
		openapi: {
			info: {
				title: 'AI Backend',
				version: '1.0.0',
			},
		},
		transform: jsonSchemaTransform,
	})

	server.register(fastifySwaggerUi, {
		routePrefix: '/docs',
	})
}

server.register(fastifyMultipart)

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.register(metricsPlugin)

server.get('/health', (request, reply) => {
	return { status: 'ok' }
})

server.get('/ping', async () => {
	return { pong: 'it worked!' }
})

server.register(getRoomsRoute)
server.register(createRoomRoute)
server.register(getRoomQuestionsRoute)
server.register(createQuestionRoute)
server.register(uploadAudioRoute)

export { server }
