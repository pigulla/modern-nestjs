import { Module } from '@nestjs/common'
import type { IConfig } from 'config'

import { CONFIG, type Config, config } from '#infrastructure/config/config.js'
import { DATABASE_CONFIG, type DatabaseConfig } from '#infrastructure/config/database.config.js'
import { LOGGING_CONFIG, type LoggingConfig } from '#infrastructure/config/logging.config.js'
import { OPEN_API_CONFIG, type OpenApiConfig } from '#infrastructure/config/open-api.config.js'
import { SERVER_CONFIG, type ServerConfig } from '#infrastructure/config/server.config.js'

const NODE_CONFIG = Symbol('node-config')

@Module({
  providers: [
    {
      provide: NODE_CONFIG,
      async useFactory(): Promise<IConfig> {
        // Do this asynchronously to avoid side effects when importing this module.
        const config = await import('config')
        return config.default
      },
    },
    {
      provide: CONFIG,
      inject: [NODE_CONFIG],
      useFactory(nodeConfig: IConfig): Config {
        const plain = nodeConfig.util.toObject()
        return config.parse(plain)
      },
    },
    {
      provide: SERVER_CONFIG,
      inject: [CONFIG],
      useFactory: (config: Config): ServerConfig => config.server,
    },
    {
      provide: OPEN_API_CONFIG,
      inject: [CONFIG],
      useFactory: (config: Config): OpenApiConfig => config.openApi,
    },
    {
      provide: LOGGING_CONFIG,
      inject: [CONFIG],
      useFactory: (config: Config): LoggingConfig => config.logging,
    },
    {
      provide: DATABASE_CONFIG,
      inject: [CONFIG],
      useFactory: (config: Config): DatabaseConfig => config.database,
    },
  ],
  exports: [SERVER_CONFIG, OPEN_API_CONFIG, LOGGING_CONFIG, DATABASE_CONFIG],
})
export class ConfigModule {}
