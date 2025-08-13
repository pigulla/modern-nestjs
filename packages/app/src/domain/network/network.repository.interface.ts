import type { Network, NetworkID, NetworkKey } from '#domain/network/network.js'

export abstract class INetworkRepository {
  public abstract getIdOf(key: NetworkKey): Promise<NetworkID>
  public abstract get(id: NetworkID): Promise<Network>
  public abstract getAll(): Promise<Network[]>
  public abstract insert(network: Network): Promise<Network>
}
