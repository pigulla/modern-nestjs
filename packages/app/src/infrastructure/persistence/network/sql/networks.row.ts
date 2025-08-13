import z from 'zod'

import { Network } from '#domain/network/network.js'
import { networkKeySchema } from '#domain/network/network.schema.js'

export const networksRow = z
  .strictObject({
    key: networkKeySchema,
    name: z.string(),
    url: z.url(),
  })
  .transform(data => ({
    ...data,
    toDomain: () => {
      return new Network(data)
    },
  }))
  .readonly()
  .brand('networks-row')

export type NetworksRow = z.infer<typeof networksRow>
