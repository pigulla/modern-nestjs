import { Network } from '@di/domain/network.js'
import { networkIdSchema, networkKeySchema } from '@di/domain/network.schema.js'

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const networkDtoSchema = z.strictObject({
  id: networkIdSchema,
  key: networkKeySchema,
  name: z.string().min(1),
  url: z.url(),
})

export class NetworkDTO extends createZodDto(networkDtoSchema) {}

export function domainToDTO(network: Network): NetworkDTO {
  return networkDtoSchema.parse({
    id: network.id,
    key: network.key,
    name: network.name,
    url: network.url,
  })
}
