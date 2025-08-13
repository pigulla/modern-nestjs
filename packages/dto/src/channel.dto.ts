import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const channelDtoSchema = z.strictObject({
  key: z.string().regex(/^[a-z0-9]+$/),
  name: z.string().min(1),
  director: z.string(),
  description: z.string(),
})

export class ChannelDTO extends createZodDto(channelDtoSchema) {}
