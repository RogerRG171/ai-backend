import { reset, seed } from 'drizzle-seed'
import { schema } from './schema/index.ts'
import { db, sql } from './postgres.ts'

const { questions, rooms } = schema

await reset(db, { questions, rooms })

await seed(db, { questions, rooms }).refine((f) => {
	return {
		rooms: {
			count: 20,
			columns: {
				name: f.companyName(),
				description: f.loremIpsum(),
			},
		},
		questions: {
			count: 20,
		},
	}
})

await sql.end()

console.log('Database seeded')
