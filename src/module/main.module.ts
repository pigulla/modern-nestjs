import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ClsPluginTransactional } from '@nestjs-cls/transactional'
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise'
import { ClsModule } from 'nestjs-cls'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import * as pgPromise from 'pg-promise'

import { ITimeProvider } from '#application/time-provider.interface.js'
import { IQuoteRepository } from '#domain/quote/quote-repository.interface.js'
import { DB_CONNECTION } from '#infrastructure/persistence/postgres-connection-provider.interface.js'
import { QuoteRepository } from '#infrastructure/persistence/quote/quotes-repository.js'
import { TimeProvider } from '#infrastructure/time-provider.js'
import { LoggingModule } from '#module/logging.module.js'
import { QuotesController } from '#presentation/http/quote/quotes.controller.js'

import { ConfigModule } from './config.module.js'
import { DatabaseModule } from './database.module.js'

@Module({
  controllers: [QuotesController],
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
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: IQuoteRepository, useClass: QuoteRepository },
    { provide: ITimeProvider, useClass: TimeProvider },
  ],
})
export class MainModule {}
