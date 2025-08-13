import { join } from 'node:path'

import type {
  Channel,
  ChannelID,
  ChannelIdentifier,
  ChannelKey,
} from '@modern-nestjs/domain/channel.js'

import { Injectable, type OnModuleInit } from '@nestjs/common'

import type { IChannelRepository } from '#domain/digitally-imported/channel.repository.interface.js'
import { ChannelNotFoundError } from '#domain/digitally-imported/channel-not-found.error.js'
import { AbstractRepository } from '#infrastructure/persistence/abstract.repository.js'
import { channelsRow } from '#infrastructure/persistence/channel/sql/channels.row.js'
import { IDatabase } from '#infrastructure/persistence/database.interface.js'

@Injectable()
export class ChannelRepository
  extends AbstractRepository<['get-one-by-id', 'get-one-by-key', 'get-all', 'insert']>
  implements IChannelRepository, OnModuleInit
{
  public constructor(database: IDatabase) {
    super(database, {
      directory: join(import.meta.dirname, 'sql'),
      fileNames: ['get-one-by-id', 'get-one-by-key', 'get-all', 'insert'],
    })
  }

  public get(identifier: ChannelIdentifier): Promise<Channel> {
    return 'id' in identifier ? this.getByID(identifier.id) : this.getByKey(identifier.key)
  }

  public async getByID(id: ChannelID): Promise<Channel> {
    const stmt = this.stmt.GET_ONE_BY_ID

    stmt.bind({ id })
    const rows = (await stmt.runAndReadAll()).getRowObjects()

    if (rows.length === 0) {
      throw new ChannelNotFoundError({ id })
    }

    return channelsRow.parse(rows[0]).toDomain()
  }

  public async getByKey(key: ChannelKey): Promise<Channel> {
    const stmt = this.stmt.GET_ONE_BY_KEY

    stmt.bind({ key })
    const rows = (await stmt.runAndReadAll()).getRowObjects()

    if (rows.length === 0) {
      throw new ChannelNotFoundError({ key })
    }

    return channelsRow.parse(rows[0]).toDomain()
  }

  public async getAll(): Promise<Channel[]> {
    const stmt = this.stmt.GET_ALL

    const rows = (await stmt.runAndReadAll()).getRowObjects()

    return rows.map(row => channelsRow.parse(row).toDomain())
  }

  public async insert(channel: Channel): Promise<Channel> {
    const stmt = this.stmt.INSERT

    stmt.bind({
      id: channel.id,
      key: channel.key,
      name: channel.name,
      network_id: channel.network,
      description: channel.description,
      director: channel.director,
    })

    // TODO: Handle FK violations and duplicate key errors
    const rows = (await stmt.runAndReadAll()).getRowObjects()

    return channelsRow.parse(rows[0]).toDomain()
  }
}
