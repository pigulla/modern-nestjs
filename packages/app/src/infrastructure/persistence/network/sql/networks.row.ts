import z from 'zod'

import { Network } from '#domain/network/network.js'
import { networkIdSchema, networkKeySchema } from '#domain/network/network.schema.js'

export const networksRow = z
  .strictObject({
    id: networkIdSchema,
    key: networkKeySchema,
    name: z.string(),
    url: z.httpUrl(),
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
