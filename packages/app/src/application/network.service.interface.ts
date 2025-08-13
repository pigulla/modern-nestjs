import { Network, type NetworkKey } from '@modern-nestjs/domain/network.js'

export abstract class INetworkService {
  public abstract get(key: NetworkKey): Promise<Network>
  public abstract getAll(): Promise<Network[]>
}
