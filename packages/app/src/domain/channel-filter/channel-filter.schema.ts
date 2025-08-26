import z from 'zod'

import { channelIdSchema } from '../channel/channel.schema.js'
import { networkIdSchema } from '../network/network.schema.js'

import type { ChannelFilterID, ChannelFilterKey } from './channel-filter.js'

export const channelFilterIdSchema = z.number().int().positive().brand('channel-filter-id')

export function asChannelFilterID(value: number): ChannelFilterID {
  return channelFilterIdSchema.parse(value)
}

export const channelFilterKeySchema = z
  .string()
  .regex(/^[_a-z0-9]+$/)
  .brand('channel-filter-key')

export function asChannelFilterKey(value: string): ChannelFilterKey {
  return channelFilterKeySchema.parse(value)
}

export const channelFilterSchema = z
  .strictObject({
    id: channelFilterIdSchema,
    key: channelFilterKeySchema,
    networkId: networkIdSchema,
    name: z.string().min(1),
    position: z.number().int().min(0),
    channels: z.set(channelIdSchema).readonly(),
  })
  .readonly()
  .brand('channel-filter')
