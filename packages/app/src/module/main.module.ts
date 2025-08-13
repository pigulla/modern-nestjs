import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'

import { ApplicationModule } from '#module/application.module.js'
import { ControllerModule } from '#module/controller.module.js'

import { ConfigModule } from './config.module.js'
import { DatabaseModule } from './database.module.js'
import { LoggingModule } from './logging.module.js'

@Module({
  imports: [ConfigModule, LoggingModule, DatabaseModule, ControllerModule, ApplicationModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
  ],
  exports: [ConfigModule],
})
export class MainModule {}
