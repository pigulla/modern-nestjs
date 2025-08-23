import { type LogLevel, Module } from '@nestjs/common'
import { LoggerModule, type Params } from 'nestjs-pino'
// biome-ignore lint/correctness/noUndeclaredDependencies: nestjs-pino guarantees that this package is installed
import type { Level } from 'pino'

import { LOGGING_CONFIG, type LoggingConfig } from '#infrastructure/config/logging.config.js'

import { ConfigModule } from './config.module.js'

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [LOGGING_CONFIG],
      useFactory(config: LoggingConfig): Params {
        const map: Record<LogLevel, Level> = {
          verbose: 'trace',
          debug: 'debug',
          log: 'info',
          warn: 'warn',
          error: 'error',
          fatal: 'fatal',
        }

        return {
          pinoHttp: {
            enabled: config.enabled,
            transport: {
              target: config.pretty ? 'pino-pretty' : 'pino/file',
            },
            level: map[config.level],
            autoLogging: config.requestResponse,
          },
        }
      },
    }),
  ],
})
export class LoggingModule {}
