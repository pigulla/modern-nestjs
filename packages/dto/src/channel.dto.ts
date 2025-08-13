import { Channel } from '@modern-nestjs/domain/channel.js'
import { channelIdSchema, channelKeySchema } from '@modern-nestjs/domain/channel.schema.js'

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const channelDtoSchema = z.strictObject({
  id: channelIdSchema,
  key: channelKeySchema,
  name: z.string().min(1),
  director: z.string(),
  description: z.string(),
})

export class ChannelDTO extends createZodDto(channelDtoSchema) {}

export function domainToDTO(channel: Channel): ChannelDTO {
  return channelDtoSchema.parse({
    id: channel.id,
    key: channel.key,
    name: channel.name,
    director: channel.director,
    description: channel.description,
  })
}
