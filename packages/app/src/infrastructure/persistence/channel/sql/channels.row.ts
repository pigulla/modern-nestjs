import z from 'zod'

import { Channel } from '#domain/channel/channel.js'
import { channelKeySchema } from '#domain/channel/channel.schema.js'
import { networkKeySchema } from '#domain/network/network.schema.js'

export const channelsRow = z
  .strictObject({
    key: channelKeySchema,
    network_key: networkKeySchema,
    name: z.string(),
    description: z.string(),
    director: z.string(),
  })
  .transform(data => ({
    ...data,
    toDomain: () => {
      const { network_key, ...other } = data
      return new Channel({ ...other, networkKey: network_key, similarChannels: new Set() })
    },
  }))
  .readonly()
  .brand('channels-row')

export type ChannelsRow = z.infer<typeof channelsRow>
