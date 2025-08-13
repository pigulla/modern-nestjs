import { Network } from '#domain/network/network.js'
import { networkIdSchema, networkKeySchema } from '#domain/network/network.schema.js'
import z from 'zod'

export const networksRow = z
  .strictObject({
    id: networkIdSchema,
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
