import { z } from 'zod'

export const idSchema = z.number().int().positive()

export type ID = z.infer<typeof idSchema>
