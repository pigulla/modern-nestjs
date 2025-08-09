import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ClsPluginTransactional } from '@nestjs-cls/transactional'
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise'
import { ClsModule } from 'nestjs-cls'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import * as pgPromise from 'pg-promise'

import { DB_CONNECTION } from '#infrastructure/persistence/connection-provider.interface.js'
import { AuthorModule } from '#module/author.module.js'
import { LoggingModule } from '#module/logging.module.js'
import { QuoteModule } from '#module/quote.module.js'

import { ConfigModule } from './config.module.js'
import { DatabaseModule } from './database.module.js'

@Module({
  imports: [
    LoggingModule,
    ConfigModule,
    DatabaseModule,
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [DatabaseModule],
          adapter: new TransactionalAdapterPgPromise({
            dbInstanceToken: DB_CONNECTION,
            defaultTxOptions: {
              mode: new pgPromise.default.txMode.TransactionMode({
                tiLevel: pgPromise.default.txMode.isolationLevel.serializable,
              }),
            },
          }),
        }),
      ],
    }),
    QuoteModule,
    AuthorModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
  ],
})
export class MainModule {}
