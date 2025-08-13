import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const networkDtoSchema = z.strictObject({
  key: z.string().regex(/^[a-z0-9]+$/),
  name: z.string().min(1),
  url: z.url(),
})

export class NetworkDTO extends createZodDto(networkDtoSchema) {}
