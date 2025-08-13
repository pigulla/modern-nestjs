import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const channelFilterDtoSchema = z.strictObject({
  key: z.string().regex(/^[a-z0-9]+$/),
  network: z.number().int().min(1),
  name: z.string().min(1),
  position: z.number().int().min(1),
  channels: z.array(z.number().int().min(1)),
})

export class ChannelFilterDTO extends createZodDto(channelFilterDtoSchema) {}
