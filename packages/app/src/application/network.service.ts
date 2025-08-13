import { Network, type NetworkIdentifier } from '@modern-nestjs/domain/network.js'

import { Injectable } from '@nestjs/common'

import { INetworkRepository } from '#domain/digitally-imported/network.repository.interface.js'

import type { INetworkService } from './network.service.interface.js'

@Injectable()
export class NetworkService implements INetworkService {
  private readonly repository: INetworkRepository

  public constructor(repository: INetworkRepository) {
    this.repository = repository
  }

  public get(identifier: NetworkIdentifier): Promise<Network> {
    return this.repository.get(identifier)
  }

  public getAll(): Promise<Network[]> {
    return this.repository.getAll()
  }
}
