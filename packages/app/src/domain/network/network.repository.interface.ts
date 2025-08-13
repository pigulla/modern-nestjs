import type { Network, NetworkKey } from '#domain/network/network.js'

export abstract class INetworkRepository {
  public abstract get(key: NetworkKey): Promise<Network>
  public abstract getAll(): Promise<Network[]>
  public abstract insert(network: Network): Promise<Network>
}
