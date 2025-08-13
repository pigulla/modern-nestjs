import { Network, type NetworkIdentifier } from '@modern-nestjs/domain/network.js'

export abstract class INetworkService {
  public abstract get(identifier: NetworkIdentifier): Promise<Network>
  public abstract getAll(): Promise<Network[]>
}
