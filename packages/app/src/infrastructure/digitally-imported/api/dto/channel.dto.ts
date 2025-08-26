import { keySchema } from '@di/dto/key.schema.js'

import z from 'zod'

import { channelFilterIdSchema } from '#domain/channel-filter/channel-filter.schema.js'

import { idSchema } from './id.schema.js'
import { isoDateSchema } from './iso-date.schema.js'
import { protocollessUrlTemplateSchema } from './protocolless-url-template.schema.js'

export const channelDtoSchema = z.object({
  id: idSchema,
  channel_director: z.string(),
  description_long: z.string(),
  description_short: z.string(),
  key: keySchema,
  name: z.string().min(1),
  public: z.boolean(),
  network_id: idSchema,
  asset_url: protocollessUrlTemplateSchema.nullable(),
  banner_url: protocollessUrlTemplateSchema.nullable(),
  description: z.string(),
  created_at: isoDateSchema,
  updated_at: isoDateSchema,
  similar_channels: z.array(z.strictObject({ id: idSchema, similar_channel_id: idSchema })),
  images: z
    .strictObject({
      horizontal_banner: protocollessUrlTemplateSchema,
      tall_banner: protocollessUrlTemplateSchema,
      square: protocollessUrlTemplateSchema,
      default: protocollessUrlTemplateSchema,
      compact: protocollessUrlTemplateSchema,
      vertical: protocollessUrlTemplateSchema,
    })
    .partial(),
  channel_filter_ids: z.array(channelFilterIdSchema),
})

export const channelsDtoSchema = z.array(channelDtoSchema)
