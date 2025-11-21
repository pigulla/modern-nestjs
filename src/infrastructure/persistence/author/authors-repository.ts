import { Injectable } from '@nestjs/common'
import { TransactionHost } from '@nestjs-cls/transactional'
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise'

import { ITimeProvider } from '#application/time-provider.interface.js'
import { type Author } from '#domain/author/author.js'
import { type AuthorID } from '#domain/author/author-id.js'
import { AuthorNotFoundError } from '#domain/author/author-not-found.error.js'
import { type IAuthorRepository } from '#domain/author/author-repository.interface.js'

import { authorsRow } from './sql/authors.row.js'
import { QUERY } from './sql/queries.js'

const { DELETE, GET, GET_ALL, INSERT, UPDATE } = QUERY

@Injectable()
export class AuthorRepository implements IAuthorRepository {
  private readonly timeProvider: ITimeProvider
  private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>

  public constructor(
    timeProvider: ITimeProvider,
    txHost: TransactionHost<TransactionalAdapterPgPromise>,
  ) {
    this.timeProvider = timeProvider
    this.txHost = txHost
  }

  public async get(id: AuthorID): Promise<Author> {
    const row = await this.txHost.tx.oneOrNone<unknown>(GET, { id })

    if (row === null) {
      throw new AuthorNotFoundError(id)
    }

    return authorsRow.parse(row).toDomain()
  }

  public async getAll(): Promise<Author[]> {
    const rows = await this.txHost.tx.manyOrNone<unknown>(GET_ALL)

    return rows.map(row => authorsRow.parse(row).toDomain())
  }

  public async update(
    id: AuthorID,
    { firstName, lastName }: { firstName: string; lastName: string },
  ): Promise<Author> {
    const now = this.timeProvider.now()

    const row = await this.txHost.tx.oneOrNone<unknown>(UPDATE, {
      id,
      first_name: firstName,
      last_name: lastName,
      updated_at: now.toISOString(),
    })

    if (row === null) {
      throw new AuthorNotFoundError(id)
    }

    return authorsRow.parse(row).toDomain()
  }

  public create({ firstName, lastName }: { firstName: string; lastName: string }): Promise<Author> {
    const now = this.timeProvider.now()

    return this.txHost.tx.tx(async tx => {
      const result = await tx.one<unknown>(INSERT, {
        first_name: firstName,
        last_name: lastName,
        created_at: now.toISOString(),
      })

      return authorsRow.parse(result).toDomain()
    })
  }

  public async delete(id: AuthorID): Promise<void> {
    const row = await this.txHost.tx.oneOrNone<unknown>(DELETE, { id })

    if (row === null) {
      throw new AuthorNotFoundError(id)
    }
  }
}
