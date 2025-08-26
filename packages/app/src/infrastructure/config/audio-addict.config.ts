import { z } from 'zod'

export const AUDIO_ADDICT_CONFIG = Symbol('audio-addict-config')

export const audioAddictConfig = z
  .strictObject({
    baseUrl: z.httpUrl(),
    listeningKey: z.string().regex(/^[a-z0-9]{16}$/),
  })
  .readonly()
  .brand('application-config')

export type AudioAddictConfig = z.infer<typeof audioAddictConfig>
