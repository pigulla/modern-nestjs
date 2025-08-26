import { z } from 'zod'

import { audioAddictConfig } from './audio-addict.config.js'
import { externalPlayerConfig } from './external-player.config.js'
import { loggingConfig } from './logging.config.js'
import { openApiConfig } from './open-api.config.js'
import { serverConfig } from './server.config.js'

export const CONFIG = Symbol('config')

export const config = z
  .strictObject({
    logging: loggingConfig,
    openApi: openApiConfig,
    server: serverConfig,
    audioAddict: audioAddictConfig,
    externalPlayer: externalPlayerConfig,
  })
  .readonly()
  .brand('config')

export type Config = z.infer<typeof config>
