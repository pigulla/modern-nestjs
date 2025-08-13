import z from 'zod'

import { channelKeySchema } from '#domain/channel/channel.schema.js'
import { ChannelFilter } from '#domain/channel-filter/channel-filter.js'
import { channelFilterKeySchema } from '#domain/channel-filter/channel-filter.schema.js'
import { networkKeySchema } from '#domain/network/network.schema.js'

export const channelFiltersRow = z
  .strictObject({
    key: channelFilterKeySchema,
    network_key: networkKeySchema,
    name: z.string(),
    position: z.number().int(),
    channel_keys: z.preprocess(value => JSON.parse(value as string), z.array(channelKeySchema)),
  })
  .transform(data => ({
    ...data,
    toDomain: () => {
      const { network_key, channel_keys, ...other } = data
      return new ChannelFilter({
        ...other,
        networkKey: network_key,
        channels: new Set(channel_keys),
      })
    },
  }))
  .readonly()
  .brand('channel-filters-row')

export type ChannelFiltersRow = z.infer<typeof channelFiltersRow>
