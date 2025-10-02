import { register, collectDefaultMetrics } from 'prom-client'
import type { FastifyInstance } from 'fastify'

collectDefaultMetrics({ register })

export const metricsPlugin = async (server: FastifyInstance) => {
	server.get('/metrics', async (request, reply) => {
		reply.type('text/plain')
		return register.metrics()
	})
}
