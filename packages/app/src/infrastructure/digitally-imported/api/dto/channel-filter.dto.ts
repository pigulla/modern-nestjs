import { keySchema } from '@di/dto/key.schema.js'

import z from 'zod'

import { channelDtoSchema } from './channel.dto.js'
import { isoDateSchema } from './iso-date.schema.js'
import { protocollessUrlTemplateSchema } from './protocolless-url-template.schema.js'

export const idSchema = z.number().int().positive()

export const channelFilterDtoSchema = z.object({
  id: idSchema,
  description_text: z.string(),
  description_title: z.string(),
  key: keySchema,
  name: z.string().min(1),
  position: z.number().int().min(0),
  network_id: idSchema,
  created_at: isoDateSchema.nullable(),
  updated_at: isoDateSchema.nullable(),
  images: z
    .strictObject({
      compact: protocollessUrlTemplateSchema,
      default: protocollessUrlTemplateSchema,
      horizontal_banner: protocollessUrlTemplateSchema,
    })
    .partial(),
  channels: z.array(channelDtoSchema).transform(channels => channels.map(channel => channel.id)),
})

export const channelFiltersDtoSchema = z.array(channelFilterDtoSchema)
