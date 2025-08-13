import type { NetworkKey } from '../network/network.js'

import type { Channel, ChannelKey } from './channel.js'

export abstract class IChannelRepository {
  public abstract get(key: ChannelKey): Promise<Channel>
  public abstract getAll(): Promise<Channel[]>
  public abstract getAllForNetwork(key: NetworkKey): Promise<Channel[]>
  public abstract insert(channel: Channel): Promise<Channel>
}
