import z from 'zod'

import { Channel } from '#domain/channel/channel.js'
import { channelIdSchema, channelKeySchema } from '#domain/channel/channel.schema.js'
import { networkIdSchema } from '#domain/network/network.schema.js'

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
