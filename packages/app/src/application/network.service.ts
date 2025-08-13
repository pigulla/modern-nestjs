import { Network, type NetworkKey } from '#domain/network/network.js'

import { Injectable } from '@nestjs/common'

import { INetworkRepository } from '#domain/network/network.repository.interface.js'

import type { INetworkService } from './network.service.interface.js'

@Injectable()
export class NetworkService implements INetworkService {
  private readonly repository: INetworkRepository

  public constructor(repository: INetworkRepository) {
    this.repository = repository
  }

  public async get(key: NetworkKey): Promise<Network> {
    const id = await this.repository.getIdOf(key)
    return this.repository.get(id)
  }

  public getAll(): Promise<Network[]> {
    return this.repository.getAll()
  }
}
