import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { keySchema } from './key.schema.js'

export const networkDtoSchema = z.strictObject({
  key: keySchema,
  name: z.string().min(1),
  url: z.url(),
})

export class NetworkDTO extends createZodDto(networkDtoSchema) {}
