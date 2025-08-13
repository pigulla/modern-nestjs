import { Channel, type ChannelKey } from '#domain/channel/channel.js'
import type { NetworkKey } from '#domain/network/network.js'

export abstract class IChannelService {
  public abstract get(key: ChannelKey): Promise<Channel>
  public abstract getAll(): Promise<Channel[]>
  public abstract getAllForNetwork(key: NetworkKey): Promise<Channel[]>
}
