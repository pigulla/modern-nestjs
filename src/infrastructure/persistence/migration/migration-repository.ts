import { Injectable } from '@nestjs/common'
import { TransactionHost } from '@nestjs-cls/transactional'
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise'
import { DatabaseError } from 'pg-protocol'

import { MissingMigrationsTableError } from './error/missing-migrations-table.error.js'
import { asMigration, type Migration } from './migration.js'
import { IMigrationRepository } from './migration-repository.interface.js'
import { QUERY } from './sql/queries.js'

const { GET_ALL_NAMES } = QUERY

@Injectable()
export class MigrationRepository implements IMigrationRepository {
  private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>

  public constructor(txHost: TransactionHost<TransactionalAdapterPgPromise>) {
    this.txHost = txHost
  }

  public async getAll(): Promise<Set<Migration>> {
    let migrations: Migration[]

    try {
      migrations = await this.txHost.tx.map<Migration>(
        GET_ALL_NAMES,
        { table: 'pgmigrations' },
        row => asMigration(row.name),
      )
    } catch (error) {
      if (error instanceof DatabaseError && error.code === '42P01' /* UNDEFINED_TABLE */) {
        throw new MissingMigrationsTableError('pgmigrations')
      }

      throw error
    }

    return new Set(migrations)
  }
}
