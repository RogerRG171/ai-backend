import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from '../env.ts'
import { schema } from './schema/index.ts'

const url = env.DATABASE_URL

export const sql = postgres(url)
export const db = drizzle(sql, {
	schema,
	casing: 'snake_case',
})
