import z from 'zod'

import type { NetworkID, NetworkKey } from './network.js'

export const networkIdSchema = z.number().int().positive().brand('network-id')

export function asNetworkID(value: number): NetworkID {
  return networkIdSchema.parse(value)
}

export const networkKeySchema = z
  .string()
  .regex(/^[_a-z0-9]+$/)
  .brand('network-key')

export function asNetworkKey(value: string): NetworkKey {
  return networkKeySchema.parse(value)
}

export const networkSchema = z.strictObject({
  id: networkIdSchema,
  key: networkKeySchema,
  name: z.string().min(1),
  url: z.httpUrl(),
})
