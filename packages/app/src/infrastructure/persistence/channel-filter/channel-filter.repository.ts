import { join } from 'node:path'

import { Injectable, type OnModuleInit } from '@nestjs/common'

import type {
  ChannelFilter,
  ChannelFilterID,
  ChannelFilterKey,
} from '#domain/channel-filter/channel-filter.js'
import type { IChannelFilterRepository } from '#domain/channel-filter/channel-filter.repository.interface.js'
import { ChannelFilterNotFoundError } from '#domain/channel-filter/channel-filter-not-found.error.js'
import type { NetworkID } from '#domain/network/network.js'

import { AbstractRepository } from '../abstract.repository.js'
import { IDatabase } from '../database.interface.js'

import { channelFiltersRow } from './sql/channel-filters.row.js'

@Injectable()
export class ChannelFilterRepository
  extends AbstractRepository<
    ['get-one', 'get-one-by-key', 'get-all', 'get-all-for-network', 'insert', 'assign-channel']
  >
  implements IChannelFilterRepository, OnModuleInit
{
  public constructor(database: IDatabase) {
    super(database, {
      directory: join(import.meta.dirname, 'sql'),
      fileNames: [
        'get-one',
        'get-one-by-key',
        'get-all',
        'get-all-for-network',
        'insert',
        'assign-channel',
      ],
    })
  }

  public async getByID(id: ChannelFilterID): Promise<ChannelFilter> {
    const stmt = this.stmt.GET_ONE

    stmt.bind({ id })
    const rows = (await stmt.runAndReadAll()).getRowObjects()

    if (rows.length === 0) {
      throw new ChannelFilterNotFoundError(id)
    }

    return channelFiltersRow.parse(rows[0]).toDomain()
  }

  public async getByKeyForNetwork(
    networkId: NetworkID,
    key: ChannelFilterKey,
  ): Promise<ChannelFilter> {
    const stmt = this.stmt.GET_ONE_BY_KEY

    stmt.bind({ network_id: networkId, key })
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

  public async getAllForNetwork(id: NetworkID): Promise<ChannelFilter[]> {
    const stmt = this.stmt.GET_ALL_FOR_NETWORK
    stmt.bind({ network_id: id })

    const rows = (await stmt.runAndReadAll()).getRowObjects()

    return rows.map(row => channelFiltersRow.parse(row).toDomain())
  }

  // TODO: This should happen transactionally.
  public async insert(channelFilter: ChannelFilter): Promise<ChannelFilter> {
    const insertStmt = this.stmt.INSERT
    const assignStmt = this.stmt.ASSIGN_CHANNEL

    insertStmt.bind({
      id: channelFilter.id,
      key: channelFilter.key,
      network_id: channelFilter.networkId,
      name: channelFilter.name,
      position: channelFilter.position,
    })

    await insertStmt.run()

    for (const channel_id of channelFilter.channels) {
      assignStmt.bind({ channel_id, channel_filter_id: channelFilter.id })
      await assignStmt.run()
    }

    return this.getByID(channelFilter.id)
  }
}
