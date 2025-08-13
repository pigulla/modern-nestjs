import z from 'zod'

import type { ChannelID, ChannelKey } from './channel.js'
import { networkIdSchema } from './network.schema.js'

export const channelIdSchema = z.number().int().min(1).brand('channel-id')

export const channelKeySchema = z
  .string()
  .regex(/^[a-z0-9]+$/)
  .brand('channel-key')

export function asChannelID(value: number): ChannelID {
  return channelIdSchema.parse(value)
}

export function asChannelKey(value: string): ChannelKey {
  return channelKeySchema.parse(value)
}

export const channelSchema = z
  .strictObject({
    id: channelIdSchema,
    key: channelKeySchema,
    network: networkIdSchema,
    name: z.string().min(1),
    director: z.string(),
    description: z.string(),
    similarChannels: z.set(channelIdSchema).readonly(),
  })
  .readonly()
