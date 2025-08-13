import { z } from 'zod'

export const keySchema = z.string().regex(/^[a-z0-9]+$/)

export type Key = z.infer<typeof keySchema>
