import { z } from 'zod'

export const idSchema = z.number().int().min(1)

export type ID = z.infer<typeof idSchema>
