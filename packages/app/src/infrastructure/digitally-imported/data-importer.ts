import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import {
  type DuckDBConnection,
  DuckDBInstance,
  type DuckDBPreparedStatement,
} from '@duckdb/node-api'
import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'

import { networkDtoSchema } from '#infrastructure/digitally-imported/data-importer/dto/network.dto.js'

import data from '../../../../../data.json' with { type: 'json' }

@Injectable()
export class DataImporter implements OnModuleInit, OnModuleDestroy {
  private instance: DuckDBInstance | null
  private connection: DuckDBConnection | null

  public constructor() {
    this.instance = null
    this.connection = null
  }

  private get db(): DuckDBConnection {
    if (!this.connection) {
      throw new Error('Not initialized')
    }

    return this.connection
  }

  private async loadSQL(name: string): Promise<DuckDBPreparedStatement> {
    const file = await join(import.meta.dirname, 'sql', name)
    const sql = (await readFile(file, 'utf8')).toString()

    return this.db.prepare(sql)
  }

  public async onModuleInit(): Promise<void> {
    this.instance = await DuckDBInstance.create(':memory:')
    this.connection = await this.instance.connect()

    const createTableSql = await this.loadSQL('create-tables.sql')
    await createTableSql.run()
  }

  private async loadNetworks(): Promise<void> {
    const insertNetwork = await this.loadSQL('insert-channel.sql')

    for (const item of data.networks) {
      const network = networkDtoSchema.parse(item)
    }
  }

  public onModuleDestroy(): void {
    this.db?.closeSync()
  }
}
