import { Injectable } from '@nestjs/common'

import { Network, type NetworkKey } from '#domain/network/network.js'
import { INetworkRepository } from '#domain/network/network.repository.interface.js'

import type { INetworkService } from './network.service.interface.js'

@Injectable()
export class NetworkService implements INetworkService {
  private readonly repository: INetworkRepository

  public constructor(repository: INetworkRepository) {
    this.repository = repository
  }

  public get(key: NetworkKey): Promise<Network> {
    return this.repository.get(key)
  }

  public getAll(): Promise<Network[]> {
    return this.repository.getAll()
  }
}
