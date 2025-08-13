import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { type DuckDBConnection, DuckDBInstance } from '@duckdb/node-api'
import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'

import type { IDatabase } from './database.interface.js'

@Injectable()
export class Database implements IDatabase, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(Database.name)
  private instance: DuckDBInstance | null
  private connection: DuckDBConnection | null

  public constructor() {
    this.instance = null
    this.connection = null
  }

  public get db(): DuckDBConnection {
    if (!this.connection) {
      throw new Error('Not initialized')
    }

    return this.connection
  }

  public async onModuleInit(): Promise<void> {
    this.logger.debug('Connecting to database')
    this.instance = await DuckDBInstance.create(':memory:')
    this.connection = await this.instance.connect()

    this.logger.debug('Creating database tables')

    const file = join(import.meta.dirname, 'sql', 'create-tables.sql')
    const sql = (await readFile(file, 'utf8')).toString()

    await this.db.run(sql)
  }

  public onModuleDestroy(): void {
    this.logger.debug('Disconnecting from database')
    this.db?.closeSync()
  }
}
