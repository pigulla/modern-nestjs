import z from 'zod'

import type { NetworkKey } from './network.js'

export const networkKeySchema = z
  .string()
  .regex(/^[a-z0-9]+$/)
  .brand('network-key')

export function asNetworkKey(value: string): NetworkKey {
  return networkKeySchema.parse(value)
}

export const networkSchema = z.strictObject({
  key: networkKeySchema,
  name: z.string().min(1),
  url: z.url(),
})
