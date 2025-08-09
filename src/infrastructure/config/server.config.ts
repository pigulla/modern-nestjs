import { z } from 'zod'

export const SERVER_CONFIG = Symbol('server-config')

export const serverConfig = z
  .strictObject({
    hostname: z.string().min(1),
    port: z.number().int().min(0),
  })
  .readonly()
  .brand('server-config')

export type ServerConfig = z.infer<typeof serverConfig>
