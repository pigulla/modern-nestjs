import { Module } from '@nestjs/common'

import { IQuoteRepository } from '#domain/quote/quote-repository.interface.js'
import { QuoteRepository } from '#infrastructure/persistence/quote/quotes-repository.js'
import { DatabaseModule } from '#module/database.module.js'
import { UtilityModule } from '#module/utility.module.js'
import { QuotesController } from '#presentation/http/quote/quotes.controller.js'

@Module({
  imports: [DatabaseModule, UtilityModule],
  controllers: [QuotesController],
  providers: [{ provide: IQuoteRepository, useClass: QuoteRepository }],
})
export class QuoteModule {}
