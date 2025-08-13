import z from 'zod'

import { channelKeySchema } from '../channel/channel.schema.js'
import { networkKeySchema } from '../network/network.schema.js'

import type { ChannelFilterKey } from './channel-filter.js'

export const channelFilterKeySchema = z
  .string()
  .regex(/^[a-z0-9]+$/)
  .brand('channel-filter-key')

export function asChannelFilterKey(value: string): ChannelFilterKey {
  return channelFilterKeySchema.parse(value)
}

export const channelFilterSchema = z
  .strictObject({
    key: channelFilterKeySchema,
    networkKey: networkKeySchema,
    name: z.string().min(1),
    position: z.number().int().min(1),
    channels: z.set(channelKeySchema).readonly(),
  })
  .readonly()
  .brand('channel-filter')
