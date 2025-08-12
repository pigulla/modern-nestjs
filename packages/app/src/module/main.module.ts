import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'

import { ChannelModule } from './channel.module.js'
import { ConfigModule } from './config.module.js'
import { DatabaseModule } from './database.module.js'
import { LoggingModule } from './logging.module.js'

@Module({
  imports: [ConfigModule, LoggingModule, DatabaseModule, ChannelModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
  ],
  exports: [ConfigModule],
})
export class MainModule {}
