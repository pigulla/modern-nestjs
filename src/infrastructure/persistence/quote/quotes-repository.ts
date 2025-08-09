import { Injectable } from '@nestjs/common'
import { TransactionHost } from '@nestjs-cls/transactional'
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise'

import { ITimeProvider } from '#application/time-provider.interface.js'
import { type Quote } from '#domain/quote/quote.js'
import { type QuoteID } from '#domain/quote/quote-id.js'
import { QuoteNotFoundError } from '#domain/quote/quote-not-found.error.js'
import { type IQuoteRepository } from '#domain/quote/quote-repository.interface.js'

import { QUERY } from './sql/queries.js'
import { quotesRow } from './sql/quotes.row.js'

const { DELETE, GET, GET_RANDOM, INSERT, UPDATE } = QUERY

@Injectable()
export class QuoteRepository implements IQuoteRepository {
  private readonly timeProvider: ITimeProvider
  private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>

  public constructor(
    timeProvider: ITimeProvider,
    txHost: TransactionHost<TransactionalAdapterPgPromise>,
  ) {
    this.timeProvider = timeProvider
    this.txHost = txHost
  }

  public async get(id: QuoteID): Promise<Quote> {
    const row = await this.txHost.tx.oneOrNone<unknown>(GET, { id })

    if (row === null) {
      throw new QuoteNotFoundError(id)
    }

    return quotesRow.parse(row).toDomain()
  }

  public async getRandom(): Promise<Quote | null> {
    const row = await this.txHost.tx.oneOrNone<unknown>(GET_RANDOM)

    return row ? quotesRow.parse(row).toDomain() : null
  }

  public async update(id: QuoteID, { text }: { text: string }): Promise<Quote> {
    const now = this.timeProvider.now()

    const row = await this.txHost.tx.oneOrNone<unknown>(UPDATE, {
      id,
      text,
      updated_at: now.toISOString(),
    })

    if (row === null) {
      throw new QuoteNotFoundError(id)
    }

    return quotesRow.parse(row).toDomain()
  }

  public create({ text }: { text: string }): Promise<Quote> {
    const now = this.timeProvider.now()

    return this.txHost.tx.tx(async tx => {
      const result = await tx.one<unknown>(INSERT, {
        text,
        created_at: now.toISOString(),
      })

      return quotesRow.parse(result).toDomain()
    })
  }

  public async delete(id: QuoteID): Promise<void> {
    const row = await this.txHost.tx.oneOrNone<unknown>(DELETE, { id })

    if (row === null) {
      throw new QuoteNotFoundError(id)
    }
  }
}
