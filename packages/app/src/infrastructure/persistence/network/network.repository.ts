import { join } from 'node:path'

import { Injectable, type OnModuleInit } from '@nestjs/common'

import type { Network, NetworkKey } from '#domain/network/network.js'
import type { INetworkRepository } from '#domain/network/network.repository.interface.js'
import { NetworkNotFoundError } from '#domain/network/network-not-found.error.js'

import { AbstractRepository } from '../abstract.repository.js'
import { IDatabase } from '../database.interface.js'

import { networksRow } from './sql/networks.row.js'

@Injectable()
export class NetworkRepository
  extends AbstractRepository<['get-one-by-key', 'get-one-by-key', 'get-all', 'insert']>
  implements INetworkRepository, OnModuleInit
{
  public constructor(database: IDatabase) {
    super(database, {
      directory: join(import.meta.dirname, 'sql'),
      fileNames: ['get-one-by-key', 'get-one-by-key', 'get-all', 'insert'],
    })
  }

  public async get(key: NetworkKey): Promise<Network> {
    const stmt = this.stmt.GET_ONE_BY_KEY

    stmt.bind({ key })
    const rows = (await stmt.runAndReadAll()).getRowObjects()

    if (rows.length === 0) {
      throw new NetworkNotFoundError(key)
    }

    return networksRow.parse(rows[0]).toDomain()
  }

  public async getAll(): Promise<Network[]> {
    const stmt = this.stmt.GET_ALL

    const rows = (await stmt.runAndReadAll()).getRowObjects()

    return rows.map(row => networksRow.parse(row).toDomain())
  }

  public async insert(network: Network): Promise<Network> {
    const stmt = this.stmt.INSERT

    stmt.bind({
      key: network.key,
      name: network.name,
      url: network.url,
    })

    // TODO: Handle FK violations and duplicate key errors
    const rows = (await stmt.runAndReadAll()).getRowObjects()

    return networksRow.parse(rows[0]).toDomain()
  }
}
