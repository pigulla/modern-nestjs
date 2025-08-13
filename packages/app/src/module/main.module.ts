import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'

import { DataImporter } from '#infrastructure/digitally-imported/data-importer.js'

import { ChannelModule } from './channel.module.js'
import { ChannelFilterModule } from './channel-filter.module.js'
import { ConfigModule } from './config.module.js'
import { DatabaseModule } from './database.module.js'
import { LoggingModule } from './logging.module.js'
import { NetworkModule } from './network.module.js'

@Module({
  imports: [
    ConfigModule,
    LoggingModule,
    DatabaseModule,
    ChannelModule,
    ChannelFilterModule,
    NetworkModule,
    DatabaseModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    DataImporter,
  ],
  exports: [ConfigModule],
})
export class MainModule {}
