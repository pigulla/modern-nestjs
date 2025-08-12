import { Channel, channelIdSchema, channelKeySchema } from '@modern-nestjs/domain/channel.js'

import z from 'zod'

export const channelsRow = z
  .strictObject({
    id: channelIdSchema,
    key: channelKeySchema,
    name: z.string(),
    description: z.string(),
    director: z.string(),
  })
  .transform(data => ({
    ...data,
    toDomain: () => {
      return new Channel({ ...data, similarChannels: new Set() })
    },
  }))
  .readonly()
  .brand('channels-row')

export type ChannelsRow = z.infer<typeof channelsRow>
