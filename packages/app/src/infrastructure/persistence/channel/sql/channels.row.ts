import { Channel } from '@di/domain/channel.js'
import { channelIdSchema, channelKeySchema } from '@di/domain/channel.schema.ts'
import { networkIdSchema } from '@di/domain/network.schema.ts'

import z from 'zod'

export const channelsRow = z
  .strictObject({
    id: channelIdSchema,
    key: channelKeySchema,
    network_id: networkIdSchema,
    name: z.string(),
    description: z.string(),
    director: z.string(),
  })
  .transform(data => ({
    ...data,
    toDomain: () => {
      const { network_id, ...other } = data
      return new Channel({ ...other, network: network_id, similarChannels: new Set() })
    },
  }))
  .readonly()
  .brand('channels-row')

export type ChannelsRow = z.infer<typeof channelsRow>
