import { server } from './app.ts'
import { env } from './env.ts'

server.get('/health', (req, reply) => {
	reply.status(200).send('OK')
})

const port = env.PORT

server.listen({ port, host: env.HOST_URL }, (err, address) => {
	if (err) {
		server.log.error(err)
		process.exit(1)
	}
	console.log(`Server listening on ${address}`)
})
