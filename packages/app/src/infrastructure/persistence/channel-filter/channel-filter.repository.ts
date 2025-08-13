import { join } from 'node:path'

import type {
  ChannelFilter,
  ChannelFilterID,
  ChannelFilterKey,
} from '@di/domain/channel-filter.js'
import type { NetworkID } from '@di/domain/network.js'

import { Injectable, type OnModuleInit } from '@nestjs/common'

import type { IChannelFilterRepository } from '#domain/digitally-imported/channel-filter.repository.interface.js'
import { ChannelFilterNotFoundError } from '#domain/digitally-imported/channel-filter-not-found.error.js'

import { AbstractRepository } from '../abstract.repository.js'
import { IDatabase } from '../database.interface.js'

import { channelFiltersRow } from './sql/channel-filters.row.js'

@Injectable()
export class ChannelFilterRepository
  extends AbstractRepository<
    [
      'get-one-by-id',
      'get-one-by-key',
      'get-all',
      'insert',
      'assign-channel-to-filter',
      'get-id-by-key',
    ]
  >
  implements IChannelFilterRepository, OnModuleInit
{
  public constructor(database: IDatabase) {
    super(database, {
      directory: join(import.meta.dirname, 'sql'),
      fileNames: [
        'get-one-by-id',
        'get-one-by-key',
        'get-all',
        'insert',
        'assign-channel-to-filter',
        'get-id-by-key',
      ],
    })
  }

  public async getIdOf(key: ChannelFilterKey): Promise<ChannelFilterID> {
    throw new Error('Not implemented')
  }

  public async get(id: ChannelFilterID): Promise<ChannelFilter> {
    const stmt = this.stmt.GET_ONE_BY_ID

    stmt.bind({ id })
    const rows = (await stmt.runAndReadAll()).getRowObjects()

    if (rows.length === 0) {
      throw new ChannelFilterNotFoundError({ id })
    }

    return channelFiltersRow.parse(rows[0]).toDomain()
  }

  public async getAll(): Promise<ChannelFilter[]> {
    const stmt = this.stmt.GET_ALL

    const rows = (await stmt.runAndReadAll()).getRowObjects()

    return rows.map(row => channelFiltersRow.parse(row).toDomain())
  }

  public getForNetwork(_id: NetworkID): Promise<ChannelFilter[]> {
    return Promise.resolve([])
  }

  // TODO: This should happen transactionally.
  public async insert(channelFilter: ChannelFilter): Promise<ChannelFilter> {
    const stmt = this.stmt.INSERT
    const stmt2 = this.stmt.ASSIGN_CHANNEL_TO_FILTER

    stmt.bind({
      id: channelFilter.id,
      key: channelFilter.key,
      network_id: channelFilter.network,
      name: channelFilter.name,
      position: channelFilter.position,
    })

    await stmt.run()

    for (const channel_id of channelFilter.channels) {
      stmt2.bind({ channel_id, channel_filter_id: channelFilter.id })
      await stmt2.run()
    }

    return this.get(channelFilter.id)
  }
}
