import type { Database } from '@nestjs-cls/transactional-adapter-pg-promise'
import type { IHelpers } from 'pg-promise'

export const DB_CONNECTION = Symbol.for('db-connection')

export abstract class IConnectionProvider {
  public abstract readonly database: Database
  public abstract readonly helpers: IHelpers
}
