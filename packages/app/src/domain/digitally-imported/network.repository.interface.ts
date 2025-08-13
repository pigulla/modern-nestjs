import type { Network, NetworkIdentifier } from '@modern-nestjs/domain/network.js'

export abstract class INetworkRepository {
  public abstract get(id: NetworkIdentifier): Promise<Network>
  public abstract getAll(): Promise<Network[]>
  public abstract insert(network: Network): Promise<Network>
}
