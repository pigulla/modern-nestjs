import { channelIdSchema } from '@di/domain/channel.schema.js'
import type { ChannelFilter } from '@di/domain/channel-filter.js'
import {
  channelFilterIdSchema,
  channelFilterKeySchema,
} from '@di/domain/channel-filter.schema.js'
import { networkIdSchema } from '@di/domain/network.schema.js'

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
