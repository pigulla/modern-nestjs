import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { keySchema } from './key.schema.js'

export const channelFilterDtoSchema = z.strictObject({
  key: keySchema,
  networkKey: keySchema,
  name: z.string().min(1),
  position: z.number().int().min(1),
  channels: z.array(keySchema),
})

export class ChannelFilterDTO extends createZodDto(channelFilterDtoSchema) {}
