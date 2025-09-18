import { db } from '../../db/postgres.ts'
import { rooms } from '../../db/schema/rooms.ts'

export const makeRoom = async (name: string, description: string) => {
	const result = await db
		.insert(rooms)
		.values({ name, description })
		.returning()

	return result[0]
}
