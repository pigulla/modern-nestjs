import { join } from 'node:path'

import type { Channel, ChannelID, ChannelKey } from '#domain/channel/channel.js'
import { asChannelID } from '#domain/channel/channel.schema.js'
import type { NetworkID } from '#domain/network/network.js'

import { Injectable, type OnModuleInit } from '@nestjs/common'

import type { IChannelRepository } from '#domain/channel/channel.repository.interface.js'
import { ChannelNotFoundError } from '#domain/channel/channel-not-found.error.js'
import { AbstractRepository } from '#infrastructure/persistence/abstract.repository.js'
import { channelsRow } from '#infrastructure/persistence/channel/sql/channels.row.js'
import { IDatabase } from '#infrastructure/persistence/database.interface.js'

@Injectable()
export class ChannelRepository
  extends AbstractRepository<
    ['get-all', 'get-all-for-network', 'get-id-by-key', 'get-one-by-id', 'get-one-by-key', 'insert']
  >
  implements IChannelRepository, OnModuleInit
{
  public constructor(database: IDatabase) {
    super(database, {
      directory: join(import.meta.dirname, 'sql'),
      fileNames: [
        'get-all',
        'get-all-for-network',
        'get-id-by-key',
        'get-one-by-id',
        'get-one-by-key',
        'insert',
      ],
    })
  }

  public async getIdOf(key: ChannelKey): Promise<ChannelID> {
    const stmt = this.stmt.GET_ID_BY_KEY

    stmt.bind({ key })
    const rows = (await stmt.runAndReadAll()).getRowObjects()

    if (rows.length === 0) {
      throw new ChannelNotFoundError({ key })
    }

    return asChannelID(rows[0].id as number)
  }

  public async get(id: ChannelID): Promise<Channel> {
    const stmt = this.stmt.GET_ONE_BY_ID

    stmt.bind({ id })
    const rows = (await stmt.runAndReadAll()).getRowObjects()

    if (rows.length === 0) {
      throw new ChannelNotFoundError({ id })
    }

    return channelsRow.parse(rows[0]).toDomain()
  }

  public async getAll(): Promise<Channel[]> {
    const stmt = this.stmt.GET_ALL

    const rows = (await stmt.runAndReadAll()).getRowObjects()

    return rows.map(row => channelsRow.parse(row).toDomain())
  }

  public async getAllForNetwork(id: NetworkID): Promise<Channel[]> {
    const stmt = this.stmt.GET_ALL_FOR_NETWORK
    stmt.bind({ network_id: id })

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
