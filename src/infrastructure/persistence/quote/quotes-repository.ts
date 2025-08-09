import { Injectable } from '@nestjs/common'
import { TransactionHost } from '@nestjs-cls/transactional'
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise'
import { DatabaseError } from 'pg-protocol'

import { ITimeProvider } from '#application/time-provider.interface.js'
import type { AuthorID } from '#domain/author/author-id.js'
import { AuthorNotFoundError } from '#domain/author/author-not-found.error.js'
import { InvalidQuoteError } from '#domain/quote/invalid-quote.error.js'
import { type Quote } from '#domain/quote/quote.js'
import { type QuoteID } from '#domain/quote/quote-id.js'
import { QuoteNotFoundError } from '#domain/quote/quote-not-found.error.js'
import { type IQuoteRepository } from '#domain/quote/quote-repository.interface.js'
import { ERROR_CODE } from '#infrastructure/persistence/error-codes.js'
import { UnknownDatabaseError } from '#infrastructure/persistence/unknown-database.error.js'

import { QUERY } from './sql/queries.js'
import { quotesRow } from './sql/quotes.row.js'

const { DELETE, GET, GET_ALL, GET_RANDOM, INSERT, UPDATE } = QUERY

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

  public async getAll(): Promise<Quote[]> {
    const rows = await this.txHost.tx.manyOrNone<unknown>(GET_ALL)

    return rows.map(row => quotesRow.parse(row).toDomain())
  }

  public async getRandom(): Promise<Quote | null> {
    const row = await this.txHost.tx.oneOrNone<unknown>(GET_RANDOM)

    return row ? quotesRow.parse(row).toDomain() : null
  }

  public async update(
    id: QuoteID,
    { text, authorId }: { text: string; authorId: AuthorID },
  ): Promise<Quote> {
    try {
      const row = await this.txHost.tx.oneOrNone<unknown>(UPDATE, {
        id,
        text,
        author_id: authorId,
        updated_at: this.timeProvider.now().toISOString(),
      })

      if (row === null) {
        throw new QuoteNotFoundError(id)
      }

      return quotesRow.parse(row).toDomain()
    } catch (error) {
      if (
        error instanceof DatabaseError &&
        error.code === ERROR_CODE.INTEGRITY_CONSTRAINT_VIOLATION.FOREIGN_KEY_VIOLATION
      ) {
        throw new AuthorNotFoundError(authorId)
      }
      if (error instanceof InvalidQuoteError || error instanceof QuoteNotFoundError) {
        throw error
      }

      throw new UnknownDatabaseError(error as Error)
    }
  }

  public async create({ text, authorId }: { text: string; authorId: AuthorID }): Promise<Quote> {
    try {
      return await this.txHost.tx.tx(async tx => {
        const row = await tx.one<unknown>(INSERT, {
          text,
          author_id: authorId,
          created_at: this.timeProvider.now().toISOString(),
        })

        return quotesRow.parse(row).toDomain()
      })
    } catch (error) {
      if (
        error instanceof DatabaseError &&
        error.code === ERROR_CODE.INTEGRITY_CONSTRAINT_VIOLATION.FOREIGN_KEY_VIOLATION
      ) {
        throw new AuthorNotFoundError(authorId)
      }
      if (error instanceof InvalidQuoteError) {
        throw error
      }

      throw new UnknownDatabaseError(error as Error)
    }
  }

  public async delete(id: QuoteID): Promise<void> {
    const row = await this.txHost.tx.oneOrNone<unknown>(DELETE, { id })

    if (row === null) {
      throw new QuoteNotFoundError(id)
    }
  }
}
