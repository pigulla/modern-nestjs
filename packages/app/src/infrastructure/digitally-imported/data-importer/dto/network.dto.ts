import z from 'zod'

export const networkDtoSchema = z
  .object({
    id: z.number().int(),
    key: z.string(),
    name: z.string(),
    url: z.url(),
    created_at: z.iso.date(),
    updated_at: z.iso.date(),
    active: z.boolean(),
  })
  .readonly()
  .brand('network-dto')

export type NetworkDTO = z.infer<typeof networkDtoSchema>
