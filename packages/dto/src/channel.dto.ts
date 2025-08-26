import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { idSchema } from './id.schema.js'
import { keySchema } from './key.schema.js'

export const channelDtoSchema = z.strictObject({
  id: idSchema,
  key: keySchema,
  networkId: idSchema,
  name: z.string().min(1),
  director: z.string(),
  description: z.string(),
})

export class ChannelDTO extends createZodDto(channelDtoSchema) {}
