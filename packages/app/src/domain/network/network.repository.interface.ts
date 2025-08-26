import type { Network, NetworkID, NetworkKey } from '#domain/network/network.js'

export abstract class INetworkRepository {
  public abstract getByID(id: NetworkID): Promise<Network>
  public abstract getByKey(key: NetworkKey): Promise<Network>
  public abstract getAll(): Promise<Network[]>
  public abstract insert(network: Network): Promise<Network>
}
