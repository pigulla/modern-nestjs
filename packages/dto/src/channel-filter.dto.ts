import { channelIdSchema } from '@modern-nestjs/domain/channel.schema.js'
import type { ChannelFilter } from '@modern-nestjs/domain/channel-filter.js'
import {
  channelFilterIdSchema,
  channelFilterKeySchema,
} from '@modern-nestjs/domain/channel-filter.schema.js'
import { networkIdSchema } from '@modern-nestjs/domain/network.schema.js'

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const channelFilterDtoSchema = z.strictObject({
  id: channelFilterIdSchema,
  key: channelFilterKeySchema,
  network: networkIdSchema,
  name: z.string().min(1),
  position: z.number().int().min(1),
  channels: z.array(channelIdSchema),
})

export class ChannelFilterDTO extends createZodDto(channelFilterDtoSchema) {}

export function domainToDTO(channelFilter: ChannelFilter): ChannelFilterDTO {
  return channelFilterDtoSchema.parse({
    id: channelFilter.id,
    key: channelFilter.key,
    network: channelFilter.network,
    name: channelFilter.name,
    position: channelFilter.position,
    channels: [...channelFilter.channels],
  })
}
