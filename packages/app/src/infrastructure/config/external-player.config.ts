import { z } from 'zod'

export const EXTERNAL_PLAYER_CONFIG = Symbol('external-player-config')

export const externalPlayerConfig = z
  .strictObject({
    path: z.string().min(1),
    arguments: z.array(z.string()),
  })
  .readonly()
  .brand('external-player-config')

export type ExternalPlayerConfig = z.infer<typeof externalPlayerConfig>
