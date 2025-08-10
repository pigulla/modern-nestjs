import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'

import { ConfigModule } from './config.module.js'
import { FruitModule } from './fruit.module.js'
import { LoggingModule } from './logging.module.js'

@Module({
  imports: [ConfigModule, LoggingModule, FruitModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
  ],
  exports: [ConfigModule],
})
export class MainModule {}
