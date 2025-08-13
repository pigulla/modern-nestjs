import z from 'zod'

import { channelIdSchema } from '#domain/channel/channel.schema.js'

export const channelDtoSchema = z
  .object({
    id: z.number().int(),
    key: z.string(),
    name: z.string(),
    description: z.string(),
    created_at: z.iso.date(),
    updated_at: z.iso.date(),
    director: z.string(),
    network_id: z.number().int(),
    similar_channels: z
      .array(
        z
          .object({
            id: z.number().int(),
            similar_channel_id: channelIdSchema,
          })
          .readonly(),
      )
      .readonly(),
  })
  .readonly()
  .brand('network-dto')

export type ChannelDTO = z.infer<typeof channelDtoSchema>
