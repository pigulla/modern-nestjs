import z from 'zod'

import { networkIdSchema } from '#domain/network/network.schema.js'

import type { ChannelID, ChannelKey } from './channel.js'

export const channelIdSchema = z.number().int().positive().brand('channel-id')

export function asChannelID(value: number): ChannelID {
  return channelIdSchema.parse(value)
}

export const channelKeySchema = z
  .string()
  .regex(/^[_a-z0-9]+$/)
  .brand('channel-key')

export function asChannelKey(value: string): ChannelKey {
  return channelKeySchema.parse(value)
}

export const channelSchema = z
  .strictObject({
    id: channelIdSchema,
    key: channelKeySchema,
    networkId: networkIdSchema,
    name: z.string().min(1),
    director: z.string(),
    description: z.string(),
    similar: z.set(channelIdSchema).readonly(),
  })
  .readonly()
