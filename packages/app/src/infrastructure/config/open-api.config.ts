import { z } from 'zod'

export const OPEN_API_CONFIG = Symbol('open-api-config')

export const openApiConfig = z
  .strictObject({
    server: z.httpUrl(),
    title: z.string(),
    description: z.string(),
    version: z.string(),
    license: z.strictObject({
      name: z.string(),
      url: z.httpUrl(),
    }),
    contact: z.strictObject({
      name: z.string(),
      url: z.httpUrl(),
      email: z.email(),
    }),
    swagger: z.strictObject({ enabled: z.boolean(), path: z.string() }).readonly(),
  })
  .readonly()
  .brand('openapi-config')

export type OpenApiConfig = z.infer<typeof openApiConfig>
