import z from 'zod'

import { channelIdSchema } from './channel.schema.js'
import type { ChannelFilterID, ChannelFilterKey } from './channel-filter.js'
import { networkIdSchema } from './network.schema.js'

export const channelFilterIdSchema = z.number().int().min(1).brand('channel-filter-id')

export const channelFilterKeySchema = z
  .string()
  .regex(/^[a-z0-9]+$/)
  .brand('channel-filter-key')

export function asChannelFilterID(value: number): ChannelFilterID {
  return channelFilterIdSchema.parse(value)
}

export function asChannelFilterKey(value: string): ChannelFilterKey {
  return channelFilterKeySchema.parse(value)
}

export const channelFilterSchema = z
  .strictObject({
    id: channelFilterIdSchema,
    key: channelFilterKeySchema,
    network: networkIdSchema,
    name: z.string().min(1),
    position: z.number().int().min(1),
    channels: z.set(channelIdSchema).readonly(),
  })
  .readonly()
  .brand('channel-filter')
