import { join } from 'node:path'

import type { Channel, ChannelID, ChannelKey } from '@modern-nestjs/domain/channel.js'

import type { DuckDBPreparedStatement } from '@duckdb/node-api'
import { Injectable, type OnModuleInit } from '@nestjs/common'

import type { IChannelRepository } from '#domain/digitally-imported/channel.repository.interface.js'
import { ChannelNotFoundError } from '#domain/digitally-imported/channel-not-found.error.js'
import { channelsRow } from '#infrastructure/persistence/channel/sql/channel.row.js'
import { IDatabase } from '#infrastructure/persistence/database.interface.js'

@Injectable()
export class ChannelRepository implements IChannelRepository, OnModuleInit {
  private readonly database: IDatabase
  private statements: {
    getAll: DuckDBPreparedStatement
    getOneById: DuckDBPreparedStatement
    getOneByKey: DuckDBPreparedStatement
  } | null

  public constructor(database: IDatabase) {
    this.database = database
    this.statements = null
  }

  public async onModuleInit(): Promise<void> {
    this.statements = {
      getAll: await this.database.loadSQL(join(import.meta.dirname, 'sql', 'get-all.sql')),
      getOneById: await this.database.loadSQL(
        join(import.meta.dirname, 'sql', 'get-one-by-id.sql'),
      ),
      getOneByKey: await this.database.loadSQL(
        join(import.meta.dirname, 'sql', 'get-one-by-key.sql'),
      ),
    }
  }

  public async getByID(id: ChannelID): Promise<Channel> {
    const stmt = this.statements!.getOneById

    stmt.bind({ id })
    const rows = (await stmt.runAndReadAll()).getRowObjects()

    if (rows.length === 0) {
      throw new ChannelNotFoundError({ id })
    }

    return channelsRow.parse(rows[0]).toDomain()
  }

  public async getByKey(key: ChannelKey): Promise<Channel> {
    const stmt = this.statements!.getOneByKey

    stmt.bind({ key })
    const rows = (await stmt.runAndReadAll()).getRowObjects()

    if (rows.length === 0) {
      throw new ChannelNotFoundError({ key })
    }

    return channelsRow.parse(rows[0]).toDomain()
  }

  public async getAll(): Promise<Channel[]> {
    const stmt = this.statements!.getAll

    const rows = (await stmt.runAndReadAll()).getRowObjects()

    return rows.map(row => channelsRow.parse(row).toDomain())
  }

  public insert(_channel: Channel): Promise<Channel> {
    throw new Error('Method not implemented.')
  }
}
