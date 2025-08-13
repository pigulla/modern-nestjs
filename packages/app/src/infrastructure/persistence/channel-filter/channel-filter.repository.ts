import { join } from 'node:path'

import { Injectable, type OnModuleInit } from '@nestjs/common'

import type { ChannelFilter, ChannelFilterKey } from '#domain/channel-filter/channel-filter.js'
import type { IChannelFilterRepository } from '#domain/channel-filter/channel-filter.repository.interface.js'
import { ChannelFilterNotFoundError } from '#domain/channel-filter/channel-filter-not-found.error.js'
import type { NetworkKey } from '#domain/network/network.js'

import { AbstractRepository } from '../abstract.repository.js'
import { IDatabase } from '../database.interface.js'

import { channelFiltersRow } from './sql/channel-filters.row.js'

@Injectable()
export class ChannelFilterRepository
  extends AbstractRepository<
    ['get-one-by-key', 'get-all', 'get-all-for-network', 'insert', 'assign-channel-to-filter']
  >
  implements IChannelFilterRepository, OnModuleInit
{
  public constructor(database: IDatabase) {
    super(database, {
      directory: join(import.meta.dirname, 'sql'),
      fileNames: [
        'get-one-by-key',
        'get-all',
        'get-all-for-network',
        'insert',
        'assign-channel-to-filter',
      ],
    })
  }

  public async get(key: ChannelFilterKey): Promise<ChannelFilter> {
    const stmt = this.stmt.GET_ONE_BY_KEY

    stmt.bind({ key })
    const rows = (await stmt.runAndReadAll()).getRowObjects()

    if (rows.length === 0) {
      throw new ChannelFilterNotFoundError(key)
    }

    return channelFiltersRow.parse(rows[0]).toDomain()
  }

  public async getAll(): Promise<ChannelFilter[]> {
    const stmt = this.stmt.GET_ALL

    const rows = (await stmt.runAndReadAll()).getRowObjects()

    return rows.map(row => channelFiltersRow.parse(row).toDomain())
  }

  public async getAllForNetwork(key: NetworkKey): Promise<ChannelFilter[]> {
    const stmt = this.stmt.GET_ALL_FOR_NETWORK
    stmt.bind({ network_key: key })

    const rows = (await stmt.runAndReadAll()).getRowObjects()

    return rows.map(row => channelFiltersRow.parse(row).toDomain())
  }

  // TODO: This should happen transactionally.
  public async insert(channelFilter: ChannelFilter): Promise<ChannelFilter> {
    const stmt = this.stmt.INSERT
    const stmt2 = this.stmt.ASSIGN_CHANNEL_TO_FILTER

    stmt.bind({
      key: channelFilter.key,
      network_key: channelFilter.networkKey,
      name: channelFilter.name,
      position: channelFilter.position,
    })

    await stmt.run()

    for (const channel_key of channelFilter.channels) {
      stmt2.bind({ channel_key, channel_filter_key: channelFilter.key })
      await stmt2.run()
    }

    return this.get(channelFilter.key)
  }
}
