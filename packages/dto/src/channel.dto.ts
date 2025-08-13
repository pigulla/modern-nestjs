import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { keySchema } from './key.schema.js'

export const channelDtoSchema = z.strictObject({
  key: keySchema,
  networkKey: keySchema,
  name: z.string().min(1),
  director: z.string(),
  description: z.string(),
})

export class ChannelDTO extends createZodDto(channelDtoSchema) {}
