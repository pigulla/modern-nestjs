import z from 'zod'

import { channelIdSchema } from '#domain/channel/channel.schema.js'
import { ChannelFilter } from '#domain/channel-filter/channel-filter.js'
import {
  channelFilterIdSchema,
  channelFilterKeySchema,
} from '#domain/channel-filter/channel-filter.schema.js'
import { networkIdSchema } from '#domain/network/network.schema.js'

export const channelFiltersRow = z
  .strictObject({
    id: channelFilterIdSchema,
    key: channelFilterKeySchema,
    network_id: networkIdSchema,
    name: z.string(),
    position: z.number().int().min(0),
    channel_ids: z.preprocess(value => JSON.parse(value as string), z.array(channelIdSchema)),
  })
  .transform(data => ({
    ...data,
    toDomain: () => {
      const { network_id, channel_ids, ...other } = data
      return new ChannelFilter({
        ...other,
        networkId: network_id,
        channels: new Set(channel_ids),
      })
    },
  }))
  .readonly()
  .brand('channel-filters-row')

export type ChannelFiltersRow = z.infer<typeof channelFiltersRow>
