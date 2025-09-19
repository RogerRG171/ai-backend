import { z } from 'zod'

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.url().startsWith('postgresql://'),
	API_KEY: z.string(),
	FRONTEND_URL: z.url(),
	HOST_URL: z.string(),
	NODE_ENV: z.string(),
})

export const env = envSchema.parse(process.env)
