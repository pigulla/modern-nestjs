import { z } from 'zod'

import { databaseConfig } from './database.config.js'
import { loggingConfig } from './logging.config.js'
import { openApiConfig } from './open-api.config.js'
import { serverConfig } from './server.config.js'

export const CONFIG = Symbol('config')

export const config = z
  .strictObject({
    database: databaseConfig,
    logging: loggingConfig,
    openApi: openApiConfig,
    server: serverConfig,
  })
  .readonly()
  .brand('config')

export type Config = z.infer<typeof config>
