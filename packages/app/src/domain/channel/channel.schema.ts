import z from 'zod'

import { networkKeySchema } from '../network/network.schema.js'

import type { ChannelKey } from './channel.js'

export const channelKeySchema = z
  .string()
  .regex(/^[a-z0-9]+$/)
  .brand('channel-key')

export function asChannelKey(value: string): ChannelKey {
  return channelKeySchema.parse(value)
}

export const channelSchema = z
  .strictObject({
    key: channelKeySchema,
    networkKey: networkKeySchema,
    name: z.string().min(1),
    director: z.string(),
    description: z.string(),
    similarChannels: z.set(channelKeySchema).readonly(),
  })
  .readonly()
