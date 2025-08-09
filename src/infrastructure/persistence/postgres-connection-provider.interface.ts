import type { Database } from '@nestjs-cls/transactional-adapter-pg-promise'
import type { IHelpers, ITask } from 'pg-promise'

export type Transaction = ITask<unknown>

export const DB_CONNECTION = Symbol.for('db-connection')

export abstract class IPostgresConnectionProvider {
  public abstract readonly database: Database
  public abstract readonly helpers: IHelpers
}
