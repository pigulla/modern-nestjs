import { Inject, Injectable, Logger, type OnApplicationShutdown } from '@nestjs/common'
import { type Database } from '@nestjs-cls/transactional-adapter-pg-promise'
import dayjs from 'dayjs'
import pgPromise, { type IEventContext, type IHelpers } from 'pg-promise'

import { DATABASE_CONFIG, type DatabaseConfig } from '../config/database.config.js'

@Injectable()
export class PostgresConnectionProvider implements OnApplicationShutdown {
  public readonly database: Database
  public readonly helpers: IHelpers

  private readonly config: DatabaseConfig
  private readonly logger: Logger

  public constructor(@Inject(DATABASE_CONFIG) config: DatabaseConfig) {
    this.config = config
    this.logger = new Logger(PostgresConnectionProvider.name)

    const pgp = pgPromise({
      query: event => this.onQuery(event),
      noWarnings: config.disableWarnings,
    })
    pgp.pg.types.setTypeParser(1114 /* TIMESTAMP */, value => dayjs(value))
    pgp.pg.types.setTypeParser(1184 /* TIMESTAMPTZ */, value => dayjs(value))

    this.helpers = pgp.helpers
    this.database = pgp({
      application_name: config.connection.name,
      host: config.connection.host,
      database: config.connection.database,
      port: config.connection.port,
      user: config.connection.username,
      password: config.connection.password,
      ssl: config.connection.ssl,
    })
  }

  private onQuery(event: IEventContext): void {
    if (!this.config.logQueries) {
      return
    }

    this.logger.verbose(
      {
        query: event.query as string,
        params: (event.params as string[] | undefined) ?? [],
      },
      'Query',
    )
  }

  public async onApplicationShutdown(_signal?: string): Promise<void> {
    this.logger.verbose('Closing connection')
    await this.database.$pool.end()
    this.logger.log('Connection closed')
  }
}
