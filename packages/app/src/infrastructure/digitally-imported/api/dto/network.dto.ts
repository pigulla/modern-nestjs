import { keySchema } from '@di/dto/key.schema.js'

import z from 'zod'

import { idSchema } from './id.schema.js'
import { isoDateSchema } from './iso-date.schema.js'

export const networkDtoSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  key: keySchema,
  url: z.httpUrl(),
  description: z.string().nullable(),
  created_at: isoDateSchema,
  updated_at: isoDateSchema,
  active: z.boolean(),
  listen_url: z.httpUrl(),
  service_key: z.string(),
  active_channel_count: z.number().int().positive(),
})

export const networksDtoSchema = z.array(networkDtoSchema)
